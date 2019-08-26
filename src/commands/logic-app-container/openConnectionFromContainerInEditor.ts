/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseEditor } from "vscode-azureextensionui";
import { ApiConnectionTreeItem } from "../../tree/logic-app-container/ApiConnectionTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function openConnectionFromContainerInEditor(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined, editor: BaseEditor<ApiConnectionTreeItem>): Promise<void> {
    let apiConnectionTreeItem: ApiConnectionTreeItem | undefined;
    if (node === undefined || node.contextValue !== ApiConnectionTreeItem.contextValue) {
        apiConnectionTreeItem = await tree.showNodePicker<ApiConnectionTreeItem>(ApiConnectionTreeItem.contextValue);
    } else {
        apiConnectionTreeItem = node as ApiConnectionTreeItem;
    }

    if (apiConnectionTreeItem === undefined) {
        return;
    }

    await editor.showEditor(apiConnectionTreeItem);
}
