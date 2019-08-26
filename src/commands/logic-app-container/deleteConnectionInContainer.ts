/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { ApiConnectionTreeItem } from "../../tree/logic-app-container/ApiConnectionTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function deleteConnectionInContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let apiConnectionTreeItem: ApiConnectionTreeItem | undefined;
    if (node === undefined || node.contextValue !== ApiConnectionTreeItem.contextValue) {
        apiConnectionTreeItem = await tree.showNodePicker<ApiConnectionTreeItem>(ApiConnectionTreeItem.contextValue);
    } else {
        apiConnectionTreeItem = node as ApiConnectionTreeItem;
    }

    if (apiConnectionTreeItem === undefined) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.deletingConnection", "Deleting connection...")
    };

    await vscode.window.withProgress(options, async () => {
        await apiConnectionTreeItem!.delete();
        tree.refresh();
    });
}
