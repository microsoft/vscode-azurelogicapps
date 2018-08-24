/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../localize";
import { IntegrationAccountMapTreeItem } from "../tree/integration-account/IntegrationAccountMapTreeItem";
import { openAndShowTextDocument } from "../utils/commandUtils";

export async function deleteIntegrationAccountMap(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountMapTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azIntegrationAccounts.deleting", "Deleting..."),
        async () => {
            await node!.deleteNode();
        }
    );
}

export async function openIntegrationAccountMapInEditor(tree: AzureTreeDataProvider, editor: BaseEditor<IAzureNode>, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountMapTreeItem.contextValue);
    }

    await editor.showEditor(node);
}

export async function viewIntegrationAccountMapDefinition(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountMapTreeItem.contextValue);
    }

    const map = node.treeItem as IntegrationAccountMapTreeItem;
    const mapDefinition = await map.getDefinition();

    await openAndShowTextDocument(mapDefinition, "json");
}
