/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { LogicAppRunTreeItem } from "../../tree/logic-app-container/LogicAppRunTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function resubmitRunInContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppRunTreeItem: LogicAppRunTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppRunTreeItem.contextValue) {
        logicAppRunTreeItem = await tree.showNodePicker<LogicAppRunTreeItem>(LogicAppRunTreeItem.contextValue);
    } else {
        logicAppRunTreeItem = node as LogicAppRunTreeItem;
    }

    if (logicAppRunTreeItem === undefined) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.resubmittingRun", "Resubmitting run...")
    };

    await vscode.window.withProgress(options, async () => {
        await logicAppRunTreeItem!.resubmit();
        tree.refresh();
    });
}
