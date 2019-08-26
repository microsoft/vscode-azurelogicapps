/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { LogicAppContainerTreeItem } from "../../tree/logic-app-container/LogicAppContainerTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function disconnectFromContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let containerTreeItem: LogicAppContainerTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppContainerTreeItem.contextValue) {
        containerTreeItem = await tree.showNodePicker<LogicAppContainerTreeItem>(LogicAppContainerTreeItem.contextValue);
    } else {
        containerTreeItem = node as LogicAppContainerTreeItem;
    }

    if (containerTreeItem === undefined) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.disconnectingFromContainer", "Disconnecting from container...")
    };

    await vscode.window.withProgress(options, async () => {
        await containerTreeItem!.delete();
        tree.refresh();
    });
}
