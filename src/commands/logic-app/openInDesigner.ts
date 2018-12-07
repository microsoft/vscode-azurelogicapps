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

    const title = localize("azLogicApps.designerTitle", "Designer (read-only)");
    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true
    };
    const panel = vscode.window.createWebviewPanel("readonlyDesigner", title, vscode.ViewColumn.Beside, options);
    const authorization = await getAuthorization(node.credentials);
    const { subscriptionId, treeItem } = node as IAzureNode<LogicAppTreeItem>;
    const callbacks = await treeItem.getCallbacks();
    const definition = await treeItem.getData(/* refresh */ true);
    const references = await treeItem.getReferences();
    const { id: workflowId, integrationAccountId, location, resourceGroupName, sku } = treeItem;
    panel.webview.html = getWebviewContentForDesigner({ authorization, callbacks, definition, integrationAccountId, location, references, resourceGroupName, sku, subscriptionId, title, workflowId });
}
