/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogicAppContainerTreeItem } from "../../tree/logic-app-container/LogicAppContainerTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppTreeItem } from "../../tree/logic-app-container/LogicAppTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { openLogicAppFromContainerInDesigner } from "./openLogicAppFromContainerInDesigner";

export async function createLogicAppInContainer(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<string | undefined> {
    let containerTreeItem: LogicAppContainerTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppContainerTreeItem.contextValue) {
        containerTreeItem = await tree.showNodePicker<LogicAppContainerTreeItem>(LogicAppContainerTreeItem.contextValue);
    } else {
        containerTreeItem = node as LogicAppContainerTreeItem;
    }

    if (containerTreeItem === undefined) {
        return;
    }

    const logicAppNode: LogicAppTreeItem | undefined = await containerTreeItem!.createLogicAppChild();
    if (logicAppNode === undefined) {
        return;
    }

    tree.refresh();
    await openLogicAppFromContainerInDesigner(tree, logicAppNode);
    return logicAppNode.id;
}
