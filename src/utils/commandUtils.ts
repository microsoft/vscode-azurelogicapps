/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureParentNode, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";

export async function openAndShowTextDocument(content: string, language = "json") {
    const document = await vscode.workspace.openTextDocument({
        content,
        language
    });
    await vscode.window.showTextDocument(document);
}

export async function createChildNode(tree: AzureTreeDataProvider, expectedContextValue: string, node?: IAzureParentNode): Promise<IAzureNode<IAzureTreeItem>> {
    if (!node) {
        node = await tree.showNodePicker(expectedContextValue) as IAzureParentNode;
    }

    return await node.createChild();
}
