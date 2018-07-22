/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppRunTreeItem } from "../tree/LogicAppRunTreeItem";

export async function resubmitRun(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppRunTreeItem.contextValue);
    }

    node.runWithTemporaryDescription(
        localize("azLogicApps.resubmitting", "Resubmitting..."),
        async () => {
            const logicAppRunTreeItem = node!.treeItem as LogicAppRunTreeItem;
            await logicAppRunTreeItem.resubmit();
            await node!.parent!.refresh();
        }
    );
}
