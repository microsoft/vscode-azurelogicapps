/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PartnerContent } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IntegrationAccountPartnerTreeItem } from "../../tree/integration-account/IntegrationAccountPartnerTreeItem";

export class IntegrationAccountPartnerEditor extends BaseEditor<IAzureNode<IntegrationAccountPartnerTreeItem>> {
    constructor() {
        super("azIntegrationAccounts.showSavePrompt");
    }

    public async getData(node: IAzureNode<IntegrationAccountPartnerTreeItem>): Promise<string> {
        return node.treeItem.getContent();
    }

    public async getFilename(node: IAzureNode<IntegrationAccountPartnerTreeItem>): Promise<string> {
        return `${node.treeItem.label}.json`;
    }

    public async getSaveConfirmationText(node: IAzureNode<IntegrationAccountPartnerTreeItem>): Promise<string> {
        const { label } = node.treeItem;
        return localize("azIntegrationAccounts.saveConfirmationText", "Saving '{0}' will update the Partner in your integration account.", label);
    }

    public async getSize(): Promise<number> {
        return 0;
    }

    public async updateData(node: IAzureNode<IntegrationAccountPartnerTreeItem>): Promise<string> {
        if (!vscode.window.activeTextEditor) {
            throw new Error(localize("azIntegrationAccounts.errorUpdatingFile", "Cannot update Partner after it has been closed."));
        }

        const updatedText = vscode.window.activeTextEditor.document.getText();
        const updatedContent: PartnerContent = JSON.parse(updatedText);

        return await node.treeItem.update(updatedContent);
    }
}
