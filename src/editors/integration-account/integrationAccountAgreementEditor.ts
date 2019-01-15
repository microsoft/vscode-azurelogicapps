/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IntegrationAccountAgreementTreeItem } from "../../tree/integration-account/IntegrationAccountAgreementTreeItem";

export class IntegrationAccountAgreementEditor extends BaseEditor<IAzureNode<IntegrationAccountAgreementTreeItem>> {
    constructor() {
        super("azIntegrationAccounts.showSavePrompt");
    }

    public async getData(node: IAzureNode<IntegrationAccountAgreementTreeItem>): Promise<string> {
        return node.treeItem.getContent();
    }

    public async getFilename(node: IAzureNode<IntegrationAccountAgreementTreeItem>): Promise<string> {
        return `${node.treeItem.label}.json`;
    }

    public async getSaveConfirmationText(node: IAzureNode<IntegrationAccountAgreementTreeItem>): Promise<string> {
        const { label } = node.treeItem;
        return localize("azIntegrationAccounts.saveConfirmationText", "Saving '{0}' will update the Agreement in your integration account.", label);
    }

    public async getSize(): Promise<number> {
        return 0;
    }

    public async updateData(node: IAzureNode<IntegrationAccountAgreementTreeItem>): Promise<string> {
        if (!vscode.window.activeTextEditor) {
            throw new Error(localize("azIntegrationAccounts.errorUpdatingFile", "Cannot update Agreement after it has been closed."));
        }

        return node.treeItem.update(vscode.window.activeTextEditor.document.getText());
    }
}
