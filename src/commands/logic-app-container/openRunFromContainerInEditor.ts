/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogicAppRunTreeItem } from "../../tree/logic-app-container/LogicAppRunTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function openRunFromContainerInEditor(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppRunTreeItem: LogicAppRunTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppRunTreeItem.contextValue) {
        logicAppRunTreeItem = await tree.showNodePicker<LogicAppRunTreeItem>(LogicAppRunTreeItem.contextValue);
    } else {
        logicAppRunTreeItem = node as LogicAppRunTreeItem;
    }

    if (logicAppRunTreeItem === undefined) {
        return;
    }

    const content = await logicAppRunTreeItem.getData();
    await openAndShowTextDocument(content);
}
