/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { BaseEditor } from "vscode-azureextensionui";
import { Connection } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { ApiConnectionTreeItem } from "../../tree/logic-app-container/ApiConnectionTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";

export class ApiConnectionEditor extends BaseEditor<ApiConnectionTreeItem> {
    constructor(private readonly tree: LogicAppsContainerTreeDataProvider) {
        super("azureLogicApps.showSavePrompt");
    }

    public async getData(node: ApiConnectionTreeItem): Promise<string> {
        return node.getData();
    }

    public async getFilename(node: ApiConnectionTreeItem): Promise<string> {
        return `${node.label}.connection.json`;
    }

    public async getSaveConfirmationText(node: ApiConnectionTreeItem): Promise<string> {
        return localize("azLogicApps.saveConfirmationText", "Saving '{0}' will update the API connection in your container.", node.label);
    }

    public async getSize(): Promise<number> {
        return 0;
    }

    public async updateData(node: ApiConnectionTreeItem): Promise<string> {
        if (!vscode.window.activeTextEditor) {
            throw new Error(localize("azLogicApps.errorUpdatingFile", "Cannot update API connection after it has been closed."));
        }

        const connection: Connection = JSON.parse(vscode.window.activeTextEditor.document.getText());
        const updatedConnection = await node.update(connection);
        this.tree.refresh();
        return JSON.stringify(updatedConnection, null, 4);
    }
}
