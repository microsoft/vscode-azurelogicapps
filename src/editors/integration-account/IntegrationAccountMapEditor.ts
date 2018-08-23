/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { BaseEditor, IAzureNode } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IntegrationAccountMapTreeItem } from "../../tree/integration-account/IntegrationAccountMapTreeItem";

export class IntegrationAccountEditor extends BaseEditor<IAzureNode<IntegrationAccountMapTreeItem>> {
    constructor() {
        super("azIntegrationAccounts.showSavePrompt");
    }

    public async getData(node: IAzureNode<IntegrationAccountMapTreeItem>): Promise<string> {
        return node.treeItem.getData();
    }

    public async getFilename(node: IAzureNode<IntegrationAccountMapTreeItem>): Promise<string> {
        return `${node.treeItem.label}`;
    }

    public async getSaveConfirmationText(node: IAzureNode<IntegrationAccountMapTreeItem>): Promise<string> {
        const { label } = node.treeItem;
        return localize("azIntegrationAccounts.saveConfirmationText", "Saving '{0}' will update the Map in your integration account.", label);
    }

    public async getSize(): Promise<number> {
        return 0;
    }

    public async updateData(node: IAzureNode<IntegrationAccountMapTreeItem>): Promise<string> {
        if (!vscode.window.activeTextEditor) {
            throw new Error(localize("azIntegrationAccounts.errorUpdatingFile", "Cannot update Map after it has been closed."));
        }

        return await node.treeItem.update(vscode.window.activeTextEditor.document.getText());
    }
}
