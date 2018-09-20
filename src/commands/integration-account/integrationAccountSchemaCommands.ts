/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IntegrationAccountSchemaTreeItem } from "../../tree/integration-account/IntegrationAccountSchemaTreeItem";
import { openAndShowTextDocument } from "../../utils/commandUtils";

export async function deleteIntegrationAccountSchema(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountSchemaTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azIntegrationAccounts.deleting", "Deleting..."),
        async () => {
            await node!.deleteNode();
        }
    );
}

export async function openIntegrationAccountSchemaInEditor(tree: AzureTreeDataProvider, editor: BaseEditor<IAzureNode>, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountSchemaTreeItem.contextValue);
    }

    await editor.showEditor(node);
}

export async function viewIntegrationAccountSchemaProperties(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountSchemaTreeItem.contextValue);
    }

    const schema = node.treeItem as IntegrationAccountSchemaTreeItem;
    const schemaProperties = await schema.getProperties();

    await openAndShowTextDocument(schemaProperties, "json");
}
