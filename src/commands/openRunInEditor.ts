/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppRunTreeItem } from "../tree/LogicAppRunTreeItem";

export async function openRunInEditor(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppRunTreeItem.contextValue);
    }

    const content = await (node.treeItem as LogicAppRunTreeItem).getData();
    const document = await vscode.workspace.openTextDocument({
        content,
        language: "json"
    });
    await vscode.window.showTextDocument(document);
}
