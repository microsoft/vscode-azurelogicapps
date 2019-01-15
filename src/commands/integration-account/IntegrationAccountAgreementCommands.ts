/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IntegrationAccountAgreementTreeItem } from "../../tree/integration-account/IntegrationAccountAgreementTreeItem";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function deleteIntegrationAccountAgreement(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountAgreementTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azIntegrationAccounts.deleting", "Deleting..."),
        async () => {
            await node!.deleteNode();
        }
    );
}

export async function openIntegrationAccountAgreementInEditor(tree: AzureTreeDataProvider, editor: BaseEditor<IAzureNode>, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountAgreementTreeItem.contextValue);
    }

    await editor.showEditor(node);
}

export async function viewIntegrationAccountAgreementProperties(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountAgreementTreeItem.contextValue);
    }

    const agreement = node.treeItem as IntegrationAccountAgreementTreeItem;
    const agreementProperties = await agreement.getProperties();

    await openAndShowTextDocument(agreementProperties, "json");
}
