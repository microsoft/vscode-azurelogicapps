/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppVersionTreeItem } from "../tree/logic-app/LogicAppVersionTreeItem";
import { DialogResponses } from "../utils/dialogResponses";

export async function promoteVersion(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppVersionTreeItem.contextValue);
    }

    const result = await vscode.window.showWarningMessage(
        localize("azLogicApps.promotePrompt", "Are you sure that you want to promote this version?"),
        DialogResponses.yes,
        DialogResponses.no);

    if (result === DialogResponses.yes) {
        node.runWithTemporaryDescription(
            localize("azLogicApps.promoting", "Promoting..."),
            async () => {
                const logicAppRunTreeItem = node!.treeItem as LogicAppVersionTreeItem;
                await logicAppRunTreeItem.promote();
                await node!.parent!.refresh();
            }
        );
    }
}
