/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { LogicAppRunActionTreeItem } from "../tree/LogicAppRunActionTreeItem";
import { openAndShowTextDocument } from "../utils/commandUtils";

export async function openRunActionInEditor(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppRunActionTreeItem.contextValue);
    }

    const content = await (node.treeItem as LogicAppRunActionTreeItem).getData();
    await openAndShowTextDocument(content);
}
