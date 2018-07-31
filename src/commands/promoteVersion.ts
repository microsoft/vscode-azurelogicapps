/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppVersionTreeItem } from "../tree/LogicAppVersionTreeItem";

export async function promoteVersion(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppVersionTreeItem.contextValue);
    }

    node.runWithTemporaryDescription(
        localize("azLogicApps.promoting", "Promoting..."),
        async () => {
            const logicAppRunTreeItem = node!.treeItem as LogicAppVersionTreeItem;
            await logicAppRunTreeItem.promote();
            await node!.parent!.refresh();
        }
    );
}
