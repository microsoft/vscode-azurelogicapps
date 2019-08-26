/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Constants } from "../../constants";
import { ext } from "../../extensionVariables";
import { LogicAppRunTreeItem } from "../../tree/logic-app-container/LogicAppRunTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { DialogResponses } from "../../utils/dialogResponses";
import { getHostScriptPath, getWebviewContent } from "../../utils/logic-app-container/monitoringViewUtils";

export async function openRunFromContainerInMonitoringView(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppRunTreeItem: LogicAppRunTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppRunTreeItem.contextValue) {
        logicAppRunTreeItem = await tree.showNodePicker<LogicAppRunTreeItem>(LogicAppRunTreeItem.contextValue);
    } else {
        logicAppRunTreeItem = node as LogicAppRunTreeItem;
    }

    if (logicAppRunTreeItem === undefined) {
        return;
    }

    const { containerBaseUrl: baseUrl, label: title, runId, workflowId } = logicAppRunTreeItem;

    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true,
        retainContextWhenHidden: true
    };
    const panel = vscode.window.createWebviewPanel("monitoringView", title, vscode.ViewColumn.Active, options);
    const hostScriptPath = getHostScriptPath(panel.webview);
    panel.webview.html = getWebviewContent({
        apiVersion: Constants.ContainerApiVersion,
        baseUrl,
        hostScriptPath,
        runId,
        title,
        workflowId
    });
    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case "Analytics":
                    if (ext.reporter !== undefined) {
                        ext.reporter.sendTelemetryEvent("openRunFromContainerInMonitoringView", message.log);
                    }
                    break;

                case "ShowError":
                    await vscode.window.showErrorMessage(message.errorMessage, DialogResponses.ok);
                    break;

                default:
                    break;
            }
        }
    );
}
