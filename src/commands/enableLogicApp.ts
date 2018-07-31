/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export async function enableLogicApp(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azLogicApps.enabling", "Enabling..."),
        async () => {
            const logicAppTreeItem = node!.treeItem as LogicAppTreeItem;
            await logicAppTreeItem.enable();
        }
    );
}
