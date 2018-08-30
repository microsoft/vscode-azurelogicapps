/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppTreeItem } from "../tree/logic-app/LogicAppTreeItem";

export async function openInPortal(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    } else if (node.treeItem.contextValue !== LogicAppTreeItem.contextValue) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue, node);
    }

    node.openInPortal();
}
