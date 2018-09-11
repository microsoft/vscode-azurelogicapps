/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, AzureUserInput, callWithTelemetryAndErrorHandling, IActionContext, IAzureNode, IAzureParentNode, registerCommand, registerEvent, registerUIExtensionVariables } from "vscode-azureextensionui";
import TelemetryReporter from "vscode-azureextensionui/node_modules/vscode-extension-telemetry";
import { deleteLogicApp } from "./commands/deleteLogicApp";
import { disableLogicApp } from "./commands/disableLogicApp";
import { enableLogicApp } from "./commands/enableLogicApp";
import { deleteIntegrationAccount, viewIntegrationAccountProperties } from "./commands/integrationAccountCommands";
import { deleteIntegrationAccountMap, openIntegrationAccountMapInEditor, viewIntegrationAccountMapProperties } from "./commands/integrationAccountMapCommands";
import { deleteIntegrationAccountSchema, openIntegrationAccountSchemaInEditor, viewIntegrationAccountSchemaProperties } from "./commands/integrationAccountSchemaCommands";
import { openInEditor } from "./commands/openInEditor";
import { openInPortal } from "./commands/openInPortal";
import { openRunActionInEditor } from "./commands/openRunActionInEditor";
import { openRunInEditor } from "./commands/openRunInEditor";
import { openTriggerInEditor } from "./commands/openTriggerInEditor";
import { openVersionInEditor } from "./commands/openVersionInEditor";
import { promoteVersion } from "./commands/promoteVersion";
import { resubmitRun } from "./commands/resubmitRun";
import { runTrigger } from "./commands/runTrigger";
import { IntegrationAccountMapEditor } from "./editors/integration-account/IntegrationAccountMapEditor";
import { IntegrationAccountSchemaEditor } from "./editors/integration-account/IntegrationAccountSchemaEditor";
import { LogicAppEditor } from "./editors/logic-app/LogicAppEditor";
import { ext } from "./extensionVariables";
import { IntegrationAccountMapTreeItem } from "./tree/integration-account/IntegrationAccountMapTreeItem";
import { IntegrationAccountSchemaTreeItem } from "./tree/integration-account/IntegrationAccountSchemaTreeItem";
import { IntegrationAccountProvider } from "./tree/integration-account/IntegrationAccountsProvider";
import { LogicAppsProvider } from "./tree/logic-app/LogicAppsProvider";
import { createChildNode } from "./utils/commandUtils";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    registerUIExtensionVariables(ext);
    ext.context = context;

    const outputChannel = vscode.window.createOutputChannel("Azure Logic Apps");
    ext.outputChannel = outputChannel;
    context.subscriptions.push(outputChannel);

    let reporter: TelemetryReporter | undefined;
    try {
        const { aiKey, name, version } = require(context.asAbsolutePath("./package.json"));
        reporter = new TelemetryReporter(name, version, aiKey);
        ext.reporter = reporter;
        context.subscriptions.push(reporter);
    } catch (error) {
        // tslint:disable-line: no-empty
    }

    const ui = new AzureUserInput(context.globalState);
    ext.ui = ui;

    await callWithTelemetryAndErrorHandling("azureLogicApps.activate", async function activateCallback(this: IActionContext): Promise<void> {
        this.properties.isActivationEvent = "true";

        const logicAppsProvider = new LogicAppsProvider();
        const tree = new AzureTreeDataProvider(logicAppsProvider, "azureLogicApps.loadMore");
        context.subscriptions.push(tree);
        context.subscriptions.push(vscode.window.registerTreeDataProvider("azureLogicAppsExplorer", tree));

        const logicAppEditor = new LogicAppEditor();
        context.subscriptions.push(logicAppEditor);

        registerCommand("azureLogicApps.deleteLogicApp", async (node: IAzureNode) => {
            await deleteLogicApp(tree, node);
        });

        registerCommand("azureLogicApps.disableLogicApp", async (node: IAzureNode) => {
            await disableLogicApp(tree, node);
        });

        registerCommand("azureLogicApps.enableLogicApp", async (node: IAzureNode) => {
            await enableLogicApp(tree, node);
        });

        registerCommand("azureLogicApps.loadMore", async (node: IAzureNode) => {
            await tree.loadMore(node);
        });

        registerCommand("azureLogicApps.openInEditor", async (node?: IAzureNode) => {
            await openInEditor(tree, logicAppEditor, node);
        });

        registerCommand("azureLogicApps.openInPortal", async (node?: IAzureNode) => {
            await openInPortal(tree, node);
        });

        registerCommand("azureLogicApps.openRunActionInEditor", async (node?: IAzureNode) => {
            await openRunActionInEditor(tree, node);
        });

        registerCommand("azureLogicApps.openRunInEditor", async (node?: IAzureNode) => {
            await openRunInEditor(tree, node);
        });

        registerCommand("azureLogicApps.openTriggerInEditor", async (node?: IAzureNode) => {
            await openTriggerInEditor(tree, node);
        });

        registerCommand("azureLogicApps.openVersionInEditor", async (node?: IAzureNode) => {
            await openVersionInEditor(tree, node);
        });

        registerCommand("azureLogicApps.promoteVersion", async (node?: IAzureNode) => {
            await promoteVersion(tree, node);
        });

        registerCommand("azureLogicApps.refresh", async (node?: IAzureNode) => {
            await tree.refresh(node);
        });

        registerCommand("azureLogicApps.resubmitRun", async (node?: IAzureNode) => {
            await resubmitRun(tree, node);
        });

        registerCommand("azureLogicApps.runTrigger", async (node?: IAzureNode) => {
            await runTrigger(tree, node);
        });

        registerCommand("azureLogicApps.selectSubscriptions", () => {
            vscode.commands.executeCommand("azure-account.selectSubscriptions");
        });

        registerEvent(
            "azureLogicApps.logicAppEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
                await logicAppEditor.onDidSaveTextDocument(this, context.globalState, document);
            });
    });

    await callWithTelemetryAndErrorHandling("azIntegrationAccounts.activate", async function activateCallback(this: IActionContext): Promise<void> {
        this.properties.isActivationEvent = "true";

        const integrationAccountProvider = new IntegrationAccountProvider();
        const integrationAccountTree = new AzureTreeDataProvider(integrationAccountProvider, "azIntegrationAccounts.loadMore");
        context.subscriptions.push(integrationAccountTree);
        context.subscriptions.push(vscode.window.registerTreeDataProvider("azureIntegrationAccountsExplorer", integrationAccountTree));

        const integrationAccountMapEditor = new IntegrationAccountMapEditor();
        context.subscriptions.push(integrationAccountMapEditor);

        const integrationAccountSchemaEditor = new IntegrationAccountSchemaEditor();
        context.subscriptions.push(integrationAccountMapEditor);

        registerCommand("azIntegrationAccounts.createMap", async (node?: IAzureParentNode) => {
            const child = await createChildNode(integrationAccountTree, IntegrationAccountMapTreeItem.contextValue, node);
            await openIntegrationAccountMapInEditor(integrationAccountTree, integrationAccountMapEditor, child);
        });

        registerCommand("azIntegrationAccounts.createSchema", async (node?: IAzureParentNode) => {
            const child = await createChildNode(integrationAccountTree, IntegrationAccountSchemaTreeItem.contextValue, node);
            await openIntegrationAccountSchemaInEditor(integrationAccountTree, integrationAccountSchemaEditor, child);
        });

        registerCommand("azIntegrationAccounts.delete", async (node: IAzureNode) => {
            await deleteIntegrationAccount(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.deleteMap", async (node: IAzureNode) => {
            await deleteIntegrationAccountMap(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.deleteSchema", async (node: IAzureNode) => {
            await deleteIntegrationAccountSchema(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.loadMore", async (node: IAzureNode) => {
            await integrationAccountTree.loadMore(node);
        });

        registerEvent("azIntegrationAccounts.integrationAccountMapEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
            await integrationAccountMapEditor.onDidSaveTextDocument(this, context.globalState, document);
        });

        registerEvent("azIntegrationAccounts.integrationAccountSchemaEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
            await integrationAccountSchemaEditor.onDidSaveTextDocument(this, context.globalState, document);
        });

        registerCommand("azIntegrationAccounts.openMapInEditor", async (node?: IAzureNode) => {
            await openIntegrationAccountMapInEditor(integrationAccountTree, integrationAccountMapEditor, node);
        });

        registerCommand("azIntegrationAccounts.openSchemaInEditor", async (node?: IAzureNode) => {
            await openIntegrationAccountSchemaInEditor(integrationAccountTree, integrationAccountSchemaEditor, node);
        });

        registerCommand("azIntegrationAccounts.refresh", async (node?: IAzureNode) => {
            await integrationAccountTree.refresh(node);
        });

        registerCommand("azIntegrationAccounts.selectSubscriptions", () => {
            vscode.commands.executeCommand("azure-account.selectSubscriptions");
        });

        registerCommand("azIntegrationAccounts.viewIntegrationAccountMapProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountMapProperties(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.viewIntegrationAccountSchemaProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountSchemaProperties(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.viewIntegrationAccountProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountProperties(integrationAccountTree, node);
        });
    });
}

export async function deactivate(): Promise<void> {
    // tslint:disable-line: no-empty
}
