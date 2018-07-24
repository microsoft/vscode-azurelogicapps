/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, AzureUserInput, callWithTelemetryAndErrorHandling, IActionContext, IAzureNode, IAzureTreeItem, registerCommand, registerEvent, registerUIExtensionVariables } from "vscode-azureextensionui";
import TelemetryReporter from "vscode-extension-telemetry";
import { deleteLogicApp } from "./commands/deleteLogicApp";
import { disableLogicApp } from "./commands/disableLogicApp";
import { enableLogicApp } from "./commands/enableLogicApp";
import { openInEditor } from "./commands/openInEditor";
import { openInPortal } from "./commands/openInPortal";
import { openRunInEditor } from "./commands/openRunInEditor";
import { openVersionInEditor } from "./commands/openVersionInEditor";
import { promoteVersion } from "./commands/promoteVersion";
import { resubmitRun } from "./commands/resubmitRun";
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

        registerCommand("azureLogicApps.openInEditor", async (node?: IAzureNode<IAzureTreeItem>) => {
            await openInEditor(tree, logicAppEditor, node);
        });

        registerCommand("azureLogicApps.openInPortal", async (node?: IAzureNode<IAzureTreeItem>) => {
            await openInPortal(tree, node);
        });

        registerCommand("azureLogicApps.openRunInEditor", async (node?: IAzureNode<IAzureTreeItem>) => {
            await openRunInEditor(tree, node);
        });

        registerCommand("azureLogicApps.openVersionInEditor", async (node?: IAzureNode<IAzureTreeItem>) => {
            await openVersionInEditor(tree, node);
        });

        registerCommand("azureLogicApps.promoteVersion", async (node?: IAzureNode<IAzureTreeItem>) => {
            await promoteVersion(tree, node);
        });

        registerCommand("azureLogicApps.refresh", async (node?: IAzureNode<IAzureTreeItem>) => {
            await tree.refresh(node);
        });

        registerCommand("azureLogicApps.resubmitRun", async (node?: IAzureNode<IAzureTreeItem>) => {
            await resubmitRun(tree, node);
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
