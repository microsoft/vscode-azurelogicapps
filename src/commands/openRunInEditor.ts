/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { LogicAppRunTreeItem } from "../tree/logic-app/LogicAppRunTreeItem";
import { openAndShowTextDocument } from "../utils/commandUtils";

export async function openRunInEditor(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppRunTreeItem.contextValue);
    }

    const content = await (node.treeItem as LogicAppRunTreeItem).getData();
    await openAndShowTextDocument(content);
}
