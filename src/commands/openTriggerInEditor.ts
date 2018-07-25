/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppTriggerTreeItem } from "../tree/LogicAppTriggerTreeItem";

export async function openTriggerInEditor(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTriggerTreeItem.contextValue);
    }

    const content = await (node.treeItem as LogicAppTriggerTreeItem).getData();
    const document = await vscode.workspace.openTextDocument({
        content,
        language: "json"
    });
    await vscode.window.showTextDocument(document);
}
