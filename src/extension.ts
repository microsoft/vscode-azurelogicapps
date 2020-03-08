/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from "fs";
import * as vscode from "vscode";
import { AzureTreeDataProvider, AzureUserInput, callWithTelemetryAndErrorHandling, IActionContext, IAzureNode, IAzureParentNode, registerCommand, registerEvent, registerUIExtensionVariables } from "vscode-azureextensionui";
import TelemetryReporter from "vscode-extension-telemetry";
import { deleteIntegrationAccountAgreement, openIntegrationAccountAgreementInEditor, viewIntegrationAccountAgreementProperties } from "./commands/integration-account/IntegrationAccountAgreementCommands";
import { deleteIntegrationAccount, viewIntegrationAccountProperties } from "./commands/integration-account/integrationAccountCommands";
import { deleteIntegrationAccountMap, openIntegrationAccountMapInEditor, viewIntegrationAccountMapProperties } from "./commands/integration-account/integrationAccountMapCommands";
import { deleteIntegrationAccountPartner, openIntegrationAccountPartnerInEditor, viewIntegrationAccountPartnerProperties } from "./commands/integration-account/integrationAccountPartnerCommands";
import { deleteIntegrationAccountSchema, openIntegrationAccountSchemaInEditor, viewIntegrationAccountSchemaProperties } from "./commands/integration-account/integrationAccountSchemaCommands";
import { addBuildDefinitionToProject } from "./commands/logic-app/addBuildDefinitionToProject";
import { addLogicAppToProject } from "./commands/logic-app/addLogicAppToProject";
import { createLogicApp } from "./commands/logic-app/createLogicApp";
import { createProject } from "./commands/logic-app/createProject";
import { deleteLogicApp } from "./commands/logic-app/deleteLogicApp";
import { disableLogicApp } from "./commands/logic-app/disableLogicApp";
import { enableLogicApp } from "./commands/logic-app/enableLogicApp";
import { openInDesigner } from "./commands/logic-app/openInDesigner";
import { openInEditor } from "./commands/logic-app/openInEditor";
import { openInPortal } from "./commands/logic-app/openInPortal";
import { openRunActionInEditor } from "./commands/logic-app/openRunActionInEditor";
import { openRunInEditor } from "./commands/logic-app/openRunInEditor";
import { openRunInMonitoringView } from "./commands/logic-app/openRunInMonitoringView";
import { openTriggerInEditor } from "./commands/logic-app/openTriggerInEditor";
import { openVersionInDesigner } from "./commands/logic-app/openVersionInDesigner";
import { openVersionInEditor } from "./commands/logic-app/openVersionInEditor";
import { promoteVersion } from "./commands/logic-app/promoteVersion";
import { resubmitRun } from "./commands/logic-app/resubmitRun";
import { runTrigger } from "./commands/logic-app/runTrigger";
import { Constants } from "./constants";
import { IntegrationAccountAgreementEditor } from "./editors/integration-account/integrationAccountAgreementEditor";
import { IntegrationAccountMapEditor } from "./editors/integration-account/IntegrationAccountMapEditor";
import { IntegrationAccountPartnerEditor } from "./editors/integration-account/integrationAccountPartnerEditor";
import { IntegrationAccountSchemaEditor } from "./editors/integration-account/IntegrationAccountSchemaEditor";
import { LogicAppEditor } from "./editors/logic-app/LogicAppEditor";
import { ext } from "./extensionVariables";
import { IntegrationAccountAgreementsTreeItem } from "./tree/integration-account/integrationAccountAgreementsTreeItem";
import { IntegrationAccountMapsTreeItem } from "./tree/integration-account/IntegrationAccountMapsTreeItem";
import { IntegrationAccountPartnersTreeItem } from "./tree/integration-account/IntegrationAccountPartnersTreeItem";
import { IntegrationAccountSchemasTreeItem } from "./tree/integration-account/IntegrationAccountSchemasTreeItem";
import { IntegrationAccountProvider } from "./tree/integration-account/IntegrationAccountsProvider";
import { LogicAppsProvider } from "./tree/logic-app/LogicAppsProvider";
import { createChildNode } from "./utils/commandUtils";

function readJson(path: string) {
    const json = fs.readFileSync(path, "utf8");
    return JSON.parse(json);
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    registerUIExtensionVariables(ext);
    ext.context = context;

    const outputChannel = vscode.window.createOutputChannel("Azure Logic Apps");
    ext.outputChannel = outputChannel;
    context.subscriptions.push(outputChannel);

    let reporter: TelemetryReporter | undefined;
    try {
        const { aiKey, name, version } = readJson(context.asAbsolutePath("./package.json"));
        reporter = new TelemetryReporter(name, version, aiKey);
        ext.reporter = reporter;
        context.subscriptions.push(reporter);
    } catch (error) {
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

        registerCommand("azureLogicApps.addBuildDefinitionToProject", async (uri?: vscode.Uri) => {
            if (uri) {
                const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
                if (workspaceFolder) {
                    await addBuildDefinitionToProject(workspaceFolder.uri.fsPath);
                } else {
                    await addBuildDefinitionToProject(uri.fsPath);
                }
            } else {
                await addBuildDefinitionToProject();
            }
        });

        registerCommand("azureLogicApps.addLogicAppToProject", async (node: IAzureNode) => {
            await addLogicAppToProject(tree, node);
        });

        registerCommand("azureLogicApps.createLogicApp", async (node: IAzureParentNode) => {
            await createLogicApp(tree, logicAppEditor, node);
        });

        registerCommand("azureLogicApps.createProject", async () => {
            await createProject();
        });

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

        registerCommand("azureLogicApps.openInDesigner", async (node?: IAzureNode) => {
            await openInDesigner(tree, node);
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

        registerCommand("azureLogicApps.openRunInMonitoringView", async (node?: IAzureNode) => {
            await openRunInMonitoringView(tree, node);
        });

        registerCommand("azureLogicApps.openTriggerInEditor", async (node?: IAzureNode) => {
            await openTriggerInEditor(tree, node);
        });

        registerCommand("azureLogicApps.openVersionInDesigner", async (node?: IAzureNode) => {
            await openVersionInDesigner(tree, node);
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

        const integrationAccountAgreementEditor = new IntegrationAccountAgreementEditor();
        context.subscriptions.push(integrationAccountAgreementEditor);

        const integrationAccountMapEditor = new IntegrationAccountMapEditor();
        context.subscriptions.push(integrationAccountMapEditor);

        const integrationAccountPartnerEditor = new IntegrationAccountPartnerEditor();
        context.subscriptions.push(integrationAccountMapEditor);

        const integrationAccountSchemaEditor = new IntegrationAccountSchemaEditor();
        context.subscriptions.push(integrationAccountMapEditor);

        registerCommand("azIntegrationAccounts.createIntegrationAccount", async (node?: IAzureParentNode) => {
            await createChildNode(integrationAccountTree, Constants.SubscriptionContextValue, node);
        });

        registerCommand("azIntegrationAccounts.createAgreement", async (node?: IAzureParentNode) => {
            const child = await createChildNode(integrationAccountTree, IntegrationAccountAgreementsTreeItem.contextValue, node);
            await openIntegrationAccountAgreementInEditor(integrationAccountTree, integrationAccountAgreementEditor, child);
        });

        registerCommand("azIntegrationAccounts.createMap", async (node?: IAzureParentNode) => {
            const child = await createChildNode(integrationAccountTree, IntegrationAccountMapsTreeItem.contextValue, node);
            await openIntegrationAccountMapInEditor(integrationAccountTree, integrationAccountMapEditor, child);
        });

        registerCommand("azIntegrationAccounts.createPartner", async (node?: IAzureParentNode) => {
            const child = await createChildNode(integrationAccountTree, IntegrationAccountPartnersTreeItem.contextValue, node);
            await openIntegrationAccountPartnerInEditor(integrationAccountTree, integrationAccountPartnerEditor, child);
        });

        registerCommand("azIntegrationAccounts.createSchema", async (node?: IAzureParentNode) => {
            const child = await createChildNode(integrationAccountTree, IntegrationAccountSchemasTreeItem.contextValue, node);
            await openIntegrationAccountSchemaInEditor(integrationAccountTree, integrationAccountSchemaEditor, child);
        });

        registerCommand("azIntegrationAccounts.deleteIntegrationAccount", async (node: IAzureNode) => {
            await deleteIntegrationAccount(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.deleteAgreement", async (node: IAzureNode) => {
            await deleteIntegrationAccountAgreement(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.deleteMap", async (node: IAzureNode) => {
            await deleteIntegrationAccountMap(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.deletePartner", async (node: IAzureNode) => {
            await deleteIntegrationAccountPartner(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.deleteSchema", async (node: IAzureNode) => {
            await deleteIntegrationAccountSchema(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.loadMore", async (node: IAzureNode) => {
            await integrationAccountTree.loadMore(node);
        });

        registerEvent("azIntegrationAccounts.integrationAccountAgreementEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
                await integrationAccountAgreementEditor.onDidSaveTextDocument(this, context.globalState, document);
            });

        registerEvent("azIntegrationAccounts.integrationAccountMapEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
                await integrationAccountMapEditor.onDidSaveTextDocument(this, context.globalState, document);
            });

        registerEvent("azIntegrationAccounts.integrationAccountPartnerEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
                await integrationAccountPartnerEditor.onDidSaveTextDocument(this, context.globalState, document);
            });

        registerEvent("azIntegrationAccounts.integrationAccountSchemaEditor.onDidSaveTextDocument",
            vscode.workspace.onDidSaveTextDocument,
            async function (this: IActionContext, document: vscode.TextDocument): Promise<void> {
                await integrationAccountSchemaEditor.onDidSaveTextDocument(this, context.globalState, document);
            });

        registerCommand("azIntegrationAccounts.openAgreementInEditor", async (node?: IAzureNode) => {
            await openIntegrationAccountAgreementInEditor(integrationAccountTree, integrationAccountAgreementEditor, node);
        });

        registerCommand("azIntegrationAccounts.openMapInEditor", async (node?: IAzureNode) => {
            await openIntegrationAccountMapInEditor(integrationAccountTree, integrationAccountMapEditor, node);
        });

        registerCommand("azIntegrationAccounts.openPartnerInEditor", async (node?: IAzureNode) => {
            await openIntegrationAccountPartnerInEditor(integrationAccountTree, integrationAccountPartnerEditor, node);
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

        registerCommand("azIntegrationAccounts.viewAgreementProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountAgreementProperties(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.viewMapProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountMapProperties(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.viewPartnerProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountPartnerProperties(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.viewSchemaProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountSchemaProperties(integrationAccountTree, node);
        });

        registerCommand("azIntegrationAccounts.viewIntegrationAccountProperties", async (node?: IAzureNode) => {
            await viewIntegrationAccountProperties(integrationAccountTree, node);
        });
    });
}

export async function deactivate(): Promise<void> {
    // eslint disable-line @typescript-eslint/no-empty-function
}
