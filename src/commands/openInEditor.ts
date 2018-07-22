/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, BaseEditor, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export async function openInEditor(tree: AzureTreeDataProvider, editor: BaseEditor<IAzureNode<IAzureTreeItem>>, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    await editor.showEditor(node);
}
