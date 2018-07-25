/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, AzureUserInput, callWithTelemetryAndErrorHandling, IActionContext, IAzureNode, registerCommand, registerEvent, registerUIExtensionVariables } from "vscode-azureextensionui";
import TelemetryReporter from "vscode-extension-telemetry";
import { deleteLogicApp } from "./commands/deleteLogicApp";
import { disableLogicApp } from "./commands/disableLogicApp";
import { enableLogicApp } from "./commands/enableLogicApp";
import { openInEditor } from "./commands/openInEditor";
import { openInPortal } from "./commands/openInPortal";
import { openRunActionInEditor } from "./commands/openRunActionInEditor";
import { openRunInEditor } from "./commands/openRunInEditor";
import { openTriggerInEditor } from "./commands/openTriggerInEditor";
import { openVersionInEditor } from "./commands/openVersionInEditor";
import { promoteVersion } from "./commands/promoteVersion";
import { resubmitRun } from "./commands/resubmitRun";
import { runTrigger } from "./commands/runTrigger";
import { LogicAppEditor } from "./editors/LogicAppEditor";
import { ext } from "./extensionVariables";
import { LogicAppsProvider } from "./tree/LogicAppsProvider";

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
}

export async function deactivate(): Promise<void> {
    // tslint:disable-line: no-empty
}
