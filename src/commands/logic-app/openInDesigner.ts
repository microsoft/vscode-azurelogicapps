/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { LogicAppTreeItem } from "../../tree/logic-app/LogicAppTreeItem";
import { getAuthorization } from "../../utils/authorizationUtils";
import { getWebviewContentForDesigner } from "../../utils/logic-app/designerUtils";

export async function openInDesigner(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    const readOnlySuffix = localize("azLogicApps.readOnlySuffix", "(read-only)");
    const authorization = await getAuthorization(node.credentials);
    const { subscriptionId, treeItem } = node as IAzureNode<LogicAppTreeItem>;
    const callbacks = await treeItem.getCallbacks();
    const definition = await treeItem.getData(/* refresh */ true);
    const parameters = treeItem.getParameters();
    const references = await treeItem.getReferences();
    const { id: workflowId, integrationAccountId, label: workflowName, location, resourceGroupName, sku } = treeItem;
    const title = `${workflowName} ${readOnlySuffix}`;

    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true
    };
    const panel = vscode.window.createWebviewPanel("readonlyDesigner", title, vscode.ViewColumn.Beside, options);
    panel.webview.html = getWebviewContentForDesigner({
        authorization,
        callbacks,
        definition,
        integrationAccountId,
        location,
        parameters,
        references,
        resourceGroupName,
        sku,
        subscriptionId,
        title,
        workflowId
    });
}
