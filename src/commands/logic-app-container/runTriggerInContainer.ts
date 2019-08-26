/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppTriggerTreeItem } from "../../tree/logic-app-container/LogicAppTriggerTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";

export async function runTriggerInContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppTriggerTreeItem: LogicAppTriggerTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppTriggerTreeItem.contextValue) {
        logicAppTriggerTreeItem = await tree.showNodePicker<LogicAppTriggerTreeItem>(LogicAppTriggerTreeItem.contextValue);
    } else {
        logicAppTriggerTreeItem = node as LogicAppTriggerTreeItem;
    }

    if (logicAppTriggerTreeItem === undefined) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.runningTrigger", "Running trigger...")
    };

    await vscode.window.withProgress(options, async () => {
        await logicAppTriggerTreeItem!.run();
        tree.refresh();
    });
}
