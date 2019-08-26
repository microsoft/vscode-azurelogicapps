/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppVersionTreeItem } from "../../tree/logic-app-container/LogicAppVersionTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function promoteVersionInContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppVersionTreeItem: LogicAppVersionTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppVersionTreeItem.contextValue) {
        logicAppVersionTreeItem = await tree.showNodePicker<LogicAppVersionTreeItem>(LogicAppVersionTreeItem.contextValue);
    } else {
        logicAppVersionTreeItem = node as LogicAppVersionTreeItem;
    }

    if (logicAppVersionTreeItem === undefined) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.promotingVersion", "Promoting version...")
    };

    await vscode.window.withProgress(options, async () => {
        await logicAppVersionTreeItem!.promote();
        tree.refresh();
    });
}
