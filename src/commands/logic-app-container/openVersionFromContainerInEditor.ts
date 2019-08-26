/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogicAppCurrentVersionTreeItem } from "../../tree/logic-app-container/LogicAppCurrentVersionTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppVersionTreeItem } from "../../tree/logic-app-container/LogicAppVersionTreeItem";
import { TreeItemBase } from "../../tree/logic-app-container/TreeItemBase";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function openVersionFromContainerInEditor(tree: LogicAppsContainerTreeDataProvider, node: TreeItemBase | undefined): Promise<void> {
    let logicAppVersionTreeItem: LogicAppVersionTreeItem | undefined;
    if (node === undefined || !(node.contextValue === LogicAppVersionTreeItem.contextValue || node.contextValue === LogicAppCurrentVersionTreeItem.contextValue)) {
        logicAppVersionTreeItem = await tree.showNodePicker<LogicAppVersionTreeItem>(LogicAppVersionTreeItem.contextValue);
    } else {
        logicAppVersionTreeItem = node as LogicAppVersionTreeItem;
    }

    if (logicAppVersionTreeItem === undefined) {
        return;
    }

    const content = await logicAppVersionTreeItem.getData();
    await openAndShowTextDocument(content);
}
