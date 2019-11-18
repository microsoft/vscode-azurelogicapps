/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppRunTreeItem } from "../../tree/logic-app/LogicAppRunTreeItem";
import { getAuthorization } from "../../utils/authorizationUtils";
import { getWebviewContent } from "../../utils/logic-app/monitoringViewUtils";

export async function openRunInMonitoringView(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppRunTreeItem.contextValue);
    }

    const authorization = await getAuthorization(node.credentials);
    const runNode = node as IAzureNode<LogicAppRunTreeItem>;
    const { id: runId, label: title, location, resourceGroupName, workflowId } = runNode.treeItem;
    const { subscriptionId } = runNode;

    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true,
        retainContextWhenHidden: true
    };
    const panel = vscode.window.createWebviewPanel("monitoringView", title, vscode.ViewColumn.Beside, options);
    panel.webview.html = getWebviewContent({ authorization, location, resourceGroupName, runId, subscriptionId, title, workflowId });
}
