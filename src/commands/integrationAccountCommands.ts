/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../localize";
import { IntegrationAccountTreeItem } from "../tree/integration-account/IntegrationAccountTreeItem";
import { openAndShowTextDocument } from "../utils/commandUtils";
import { DialogResponses } from "../utils/dialogResponses";

export async function deleteIntegrationAccount(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountTreeItem.contextValue);
    }

    const result = await vscode.window.showWarningMessage(
        localize("azIntegrationAccounts.deleteIntegrationAccountPrompt", "Are you sure that you want to delete the whole integration account? This can not be undone."),
        DialogResponses.yes,
        DialogResponses.no);

    if (result === DialogResponses.yes) {
        await node.runWithTemporaryDescription(
            localize("azIntegrationAccounts.deleting", "Deleting..."),
            async () => {
                await node!.deleteNode();
            }
        );
    }
}

export async function viewIntegrationAccountProperties(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountTreeItem.contextValue);
    }

    const integrationAccount = node.treeItem as IntegrationAccountTreeItem;
    const integrationAccountProperties = await integrationAccount.getProperties();

    await openAndShowTextDocument(integrationAccountProperties, "json");
}
