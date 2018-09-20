/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IntegrationAccountPartnerTreeItem } from "../../tree/integration-account/IntegrationAccountPartnerTreeItem";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function deleteIntegrationAccountPartner(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountPartnerTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azIntegrationAccounts.deleting", "Deleting..."),
        async () => {
            await node!.deleteNode();
        }
    );
}

export async function openIntegrationAccountPartnerInEditor(tree: AzureTreeDataProvider, editor: BaseEditor<IAzureNode>, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountPartnerTreeItem.contextValue);
    }

    await editor.showEditor(node);
}

export async function viewIntegrationAccountPartnerProperties(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountPartnerTreeItem.contextValue);
    }

    const partner = node.treeItem as IntegrationAccountPartnerTreeItem;
    const partnerProperties = await partner.getProperties();

    await openAndShowTextDocument(partnerProperties, "json");
}
