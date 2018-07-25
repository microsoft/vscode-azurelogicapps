/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppVersionTreeItem } from "../tree/LogicAppVersionTreeItem";
import { openAndShowTextDocument } from "../utils/commandUtils";

export async function openVersionInEditor(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppVersionTreeItem.contextValue);
    }

    const content = await (node.treeItem as LogicAppVersionTreeItem).getData();
    await openAndShowTextDocument(content);
}
