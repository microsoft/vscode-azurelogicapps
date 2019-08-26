/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppTriggerTreeItem } from "../../tree/logic-app-container/LogicAppTriggerTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function openTriggerFromContainerInEditor(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppTriggerTreeItem: LogicAppTriggerTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppTriggerTreeItem.contextValue) {
        logicAppTriggerTreeItem = await tree.showNodePicker<LogicAppTriggerTreeItem>(LogicAppTriggerTreeItem.contextValue);
    } else {
        logicAppTriggerTreeItem = node as LogicAppTriggerTreeItem;
    }

    if (logicAppTriggerTreeItem === undefined) {
        return;
    }

    const content = await logicAppTriggerTreeItem.getData();
    await openAndShowTextDocument(content);
}
