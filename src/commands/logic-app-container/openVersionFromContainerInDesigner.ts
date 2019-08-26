/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Constants } from "../../constants";
import { ext } from "../../extensionVariables";
import { localize } from "../../localize";
import { LogicAppCurrentVersionTreeItem } from "../../tree/logic-app-container/LogicAppCurrentVersionTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppVersionTreeItem } from "../../tree/logic-app-container/LogicAppVersionTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { DialogResponses } from "../../utils/dialogResponses";
import { getHostScriptPath, getWebviewContentForDesigner } from "../../utils/logic-app-container/designerUtils";

export async function openVersionFromContainerInDesigner(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppVersionTreeItem: LogicAppVersionTreeItem | undefined;
    if (node === undefined || !(node.contextValue === LogicAppVersionTreeItem.contextValue || node.contextValue === LogicAppCurrentVersionTreeItem.contextValue)) {
        logicAppVersionTreeItem = await tree.showNodePicker<LogicAppVersionTreeItem>(LogicAppVersionTreeItem.contextValue);
    } else {
        logicAppVersionTreeItem = node as LogicAppVersionTreeItem;
    }

    if (logicAppVersionTreeItem === undefined) {
        return;
    }

    const { containerBaseUrl: baseUrl, label: workflowVersionName, versionId: workflowId } = logicAppVersionTreeItem;
    const callbacks = {};
    const definition = logicAppVersionTreeItem.getDefinition();
    const parameters = logicAppVersionTreeItem.getParameters();
    const references = await logicAppVersionTreeItem.getReferences();
    const readOnlySuffix = localize("azLogicApps.readOnlySuffix", "(read-only)");
    const title = `${workflowVersionName} ${readOnlySuffix}`;

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
        readOnly: true,
        references,
        title,
        workflowId
    });
    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                case "Analytics":
                    if (ext.reporter !== undefined) {
                        ext.reporter.sendTelemetryEvent("openVersionFromContainerInDesigner", message.log);
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
