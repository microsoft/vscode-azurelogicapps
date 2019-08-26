/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppTreeItem } from "../../tree/logic-app-container/LogicAppTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function deleteLogicAppInContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppTreeItem: LogicAppTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppTreeItem.contextValue) {
        logicAppTreeItem = await tree.showNodePicker<LogicAppTreeItem>(LogicAppTreeItem.contextValue);
    } else {
        logicAppTreeItem = node as LogicAppTreeItem;
    }

    if (logicAppTreeItem === undefined) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.deletingLogicApp", "Deleting Logic App...")
    };

    await vscode.window.withProgress(options, async () => {
        await logicAppTreeItem!.delete();
        tree.refresh();
    });
}
