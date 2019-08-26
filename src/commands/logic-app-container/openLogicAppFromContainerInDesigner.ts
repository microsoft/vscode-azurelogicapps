/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Constants } from "../../constants";
import { ext } from "../../extensionVariables";
import { localize } from "../../localize";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppTreeItem } from "../../tree/logic-app-container/LogicAppTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { DialogResponses } from "../../utils/dialogResponses";
import { getHostScriptPath, getWebviewContentForDesigner } from "../../utils/logic-app-container/designerUtils";

export async function openLogicAppFromContainerInDesigner(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppTreeItem: LogicAppTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppTreeItem.contextValue) {
        logicAppTreeItem = await tree.showNodePicker<LogicAppTreeItem>(LogicAppTreeItem.contextValue);
    } else {
        logicAppTreeItem = node as LogicAppTreeItem;
    }

    if (logicAppTreeItem === undefined) {
        return;
    }

    const { containerBaseUrl: baseUrl, label: title, logicAppId: workflowId } = logicAppTreeItem;
    const callbacks = await logicAppTreeItem.getCallbacks();
    const definition = logicAppTreeItem.getDefinition();
    const parameters = logicAppTreeItem.getParameters();
    const references = await logicAppTreeItem.getReferences();

    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true,
        retainContextWhenHidden: true
    };
    const panel = vscode.window.createWebviewPanel("readonlyDesigner", title, vscode.ViewColumn.Active, options);
    const hostScriptPath = getHostScriptPath(panel.webview);
    panel.webview.html = getWebviewContentForDesigner({
        apiVersion: Constants.ContainerApiVersion,
        baseUrl,
        callbacks,
        definition,
        hostScriptPath,
        parameters,
        references,
        title,
        workflowId
    });
    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case "Analytics":
                    if (ext.reporter !== undefined) {
                        ext.reporter.sendTelemetryEvent("openLogicAppFromContainerInDesigner", message.log);
                    }
                    break;

                case "OpenWindow":
                    await vscode.env.openExternal(message.url);
                    break;

                case "Save":
                    await handleSave(tree, panel.webview, logicAppTreeItem!, message.definition, message.parameters);
                    break;

                case "ShowError":
                    await vscode.window.showErrorMessage(message.errorMessage, DialogResponses.ok);
                    break;

                default:
                    break;
            }
        },
        /* thisArgs */ undefined,
        ext.context.subscriptions
    );
}

async function handleSave(tree: LogicAppsContainerTreeDataProvider, webview: vscode.Webview, node: LogicAppTreeItem, definition: string, parameters: Record<string, any>): Promise<string> {
    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.savingLogicApp", "Saving Logic App...")
    };

    const updatedDefinition = await vscode.window.withProgress(options, async () => {
        try {
            const updatedLogicApp = await node.updateDefinitionAndParameters(definition, parameters);

            const callbacks = await node.getCallbacks();
            await webview.postMessage({
                command: "UpdateCallbacks",
                callbacks
            });

            tree.refresh();

            return JSON.stringify(updatedLogicApp.properties.definition, null, 4);
        } catch (error) {
            await vscode.window.showErrorMessage(error.message, DialogResponses.ok);
            throw error;
        }
    });

    await vscode.window.showInformationMessage(localize("azLogicAppContainers.savedLogicApp", "Logic App saved."));

    return updatedDefinition;
}
