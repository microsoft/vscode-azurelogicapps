/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogicAppRunActionTreeItem } from "../../tree/logic-app-container/LogicAppRunActionTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function openRunActionFromContainerInEditor(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppRunActionTreeItem: LogicAppRunActionTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppRunActionTreeItem.contextValue) {
        logicAppRunActionTreeItem = await tree.showNodePicker<LogicAppRunActionTreeItem>(LogicAppRunActionTreeItem.contextValue);
    } else {
        logicAppRunActionTreeItem = node as LogicAppRunActionTreeItem;
    }

    if (logicAppRunActionTreeItem === undefined) {
        return;
    }

    const content = await logicAppRunActionTreeItem.getData();
    await openAndShowTextDocument(content);
}
