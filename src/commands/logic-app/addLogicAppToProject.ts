/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { ext } from "../../extensionVariables";
import { localize } from "../../localize";
import { LogicAppTreeItem } from "../../tree/logic-app/LogicAppTreeItem";
import { selectWorkspaceFolder } from "../../utils/workspaceUtils";

export async function addLogicAppToProject(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    const { workspaceFolders } = vscode.workspace;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        await vscode.window.showErrorMessage(localize("azLogicApps.noWorkspaceFolders", "You must create a project first before adding Logic Apps to a project."));
        return;
    }

    const workspaceFolderPath = workspaceFolders.length === 1
        ? workspaceFolders[0].uri.fsPath
        : await selectWorkspaceFolder(ext.ui);

    if (!workspaceFolderPath) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicApp.addingToProject", "Adding to project...")
    };

    await vscode.window.withProgress(options, async () => {
        const logicAppTreeItem = node!.treeItem as LogicAppTreeItem;
        await logicAppTreeItem.addToProject(workspaceFolderPath);
    });
}
