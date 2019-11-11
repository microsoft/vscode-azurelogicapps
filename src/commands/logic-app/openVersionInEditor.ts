/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppCurrentVersionTreeItem } from "../../tree/logic-app/LogicAppCurrentVersionTreeItem";
import { LogicAppVersionTreeItem } from "../../tree/logic-app/LogicAppVersionTreeItem";
import { openReadOnlyJson } from "../../utils/readOnlyUtils";

export async function openVersionInEditor(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker([LogicAppCurrentVersionTreeItem.contextValue, LogicAppVersionTreeItem.contextValue]);
    }

    const content = await (node.treeItem as LogicAppCurrentVersionTreeItem | LogicAppVersionTreeItem).getData();
    await openReadOnlyJson(node.id, content);
}
