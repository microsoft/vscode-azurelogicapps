/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppTriggerTreeItem } from "../tree/LogicAppTriggerTreeItem";

export async function runTrigger(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTriggerTreeItem.contextValue);
    }

    node.runWithTemporaryDescription(
        localize("azLogicApps.running", "Running..."),
        async () => {
            const logicAppTriggerTreeItem = node!.treeItem as LogicAppTriggerTreeItem;
            await logicAppTriggerTreeItem.run();
            await node!.parent!.parent!.refresh();
        }
    );
}
