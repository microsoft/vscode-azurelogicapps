/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { BaseEditor } from "vscode-azureextensionui";
import { LogicApp } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { LogicAppTreeItem } from "../../tree/logic-app-container/LogicAppTreeItem";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";

export class LogicAppEditor extends BaseEditor<LogicAppTreeItem> {
    constructor(private readonly tree: LogicAppsContainerTreeDataProvider) {
        super("azureLogicApps.showSavePrompt");
    }

    public async getData(node: LogicAppTreeItem): Promise<string> {
        return node.getData();
    }

    public async getFilename(node: LogicAppTreeItem): Promise<string> {
        return `${node.label}.logicapp.json`;
    }

    public async getSaveConfirmationText(node: LogicAppTreeItem): Promise<string> {
        return localize("azLogicApps.saveConfirmationText", "Saving '{0}' will update the Logic App in your container.", node.label);
    }

    public async getSize(): Promise<number> {
        return 0;
    }

    public async updateData(node: LogicAppTreeItem): Promise<string> {
        if (!vscode.window.activeTextEditor) {
            throw new Error(localize("azLogicApps.errorUpdatingFile", "Cannot update Logic App after it has been closed."));
        }

        const logicApp: LogicApp = JSON.parse(vscode.window.activeTextEditor.document.getText());
        const updatedLogicApp = await node.update(logicApp);
        this.tree.refresh();
        return JSON.stringify(updatedLogicApp, null, 4);
    }
}
