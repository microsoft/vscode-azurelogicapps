/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { LogicAppCurrentVersionTreeItem } from "../../tree/logic-app/LogicAppCurrentVersionTreeItem";
import { LogicAppVersionTreeItem } from "../../tree/logic-app/LogicAppVersionTreeItem";
import { getAuthorization, getCredentialsMetadata } from "../../utils/authorizationUtils";
import { getWebviewContentForDesigner } from "../../utils/logic-app/designerUtils";

export async function openVersionInDesigner(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker([LogicAppCurrentVersionTreeItem.contextValue, LogicAppVersionTreeItem.contextValue]);
    }

    const readOnlySuffix = localize("azLogicApps.readOnlySuffix", "(read-only)");
    const authorization = await getAuthorization(node.credentials);
    const { subscriptionId, treeItem } = node as IAzureNode<LogicAppVersionTreeItem>;
    const definition = await treeItem.getData();
    const parameters = treeItem.getParameters();
    const references = await treeItem.getReferences();
    const { id: workflowId, integrationAccountId, label: workflowVersionName, location, resourceGroupName, sku } = treeItem;
    const { domain: tenantId, userName: userId } = getCredentialsMetadata(node.credentials);
    const title = `${workflowVersionName} ${readOnlySuffix}`;

    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true
    };
    const panel = vscode.window.createWebviewPanel("readonlyDesigner", title, vscode.ViewColumn.Beside, options);
    panel.webview.html = getWebviewContentForDesigner({
        authorization,
        callbacks: {},
        definition,
        integrationAccountId,
        location,
        parameters,
        readOnly: true,
        references,
        resourceGroupName,
        sku,
        subscriptionId,
        tenantId,
        title,
        userId,
        workflowId
    });
}
