/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from "path";
import * as vscode from "vscode";
import { IAzureUserInput } from "vscode-azureextensionui";
import { localize } from "../localize";

interface IWorkspaceFolder extends vscode.QuickPickItem {
    data?: string;
}

const openDialogOptions: vscode.OpenDialogOptions = {
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: localize("select", "Select"),
};

const quickPickOptions: vscode.QuickPickOptions = {
    canPickMany: false
};

export async function openFolder(uri: vscode.Uri): Promise<void> {
    const { workspaceFolders } = vscode.workspace;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        await vscode.commands.executeCommand("vscode.openFolder", uri);
    } else {
        vscode.workspace.updateWorkspaceFolders(workspaceFolders.length, 0, { uri });
    }
}

export async function selectWorkspaceFolder(ui: IAzureUserInput): Promise<string | undefined> {
    const { workspaceFolders } = vscode.workspace;

    const folderItems = !workspaceFolders
        ? []
        : workspaceFolders.map(({ uri: { fsPath } }) => ({
            data: fsPath,
            description: fsPath,
            label: path.basename(fsPath)
        }));
    const browseItem = {
        label: localize("azLogicApps.browse", "$(file-directory) Browse...")
    };
    const items: IWorkspaceFolder[] = [...folderItems, browseItem];
    const selectedItem = await ui.showQuickPick(items, quickPickOptions);
    if (selectedItem && selectedItem.data) {
        return selectedItem.data;
    }

    const uris = await ui.showOpenDialog({
        ...openDialogOptions,
        ...workspaceFolders && workspaceFolders.length > 0 ? { defaultUri: workspaceFolders[0].uri } : undefined
    });
    return uris.length === 0
        ? undefined
        : uris[0].fsPath;
}
