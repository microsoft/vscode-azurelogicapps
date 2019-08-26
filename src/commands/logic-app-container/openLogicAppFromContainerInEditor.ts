/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseEditor } from "vscode-azureextensionui";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";
import { LogicAppTreeItem } from "../../tree/logic-app-container/LogicAppTreeItem";

export async function openLogicAppFromContainerInEditor(tree: LogicAppsContainerTreeDataProvider, node: LogicAppTreeItem, editor: BaseEditor<LogicAppTreeItem>): Promise<void> {
    let logicAppTreeItem: LogicAppTreeItem | undefined;
    if (node === undefined || node.contextValue !== LogicAppTreeItem.contextValue) {
        logicAppTreeItem = await tree.showNodePicker<LogicAppTreeItem>(LogicAppTreeItem.contextValue);
    } else {
        logicAppTreeItem = node as LogicAppTreeItem;
    }

    if (logicAppTreeItem === undefined) {
        return;
    }

    await editor.showEditor(logicAppTreeItem);
}
