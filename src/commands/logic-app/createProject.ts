/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from "fs-extra";
import * as vscode from "vscode";
import { ext } from "../../extensionVariables";
import { localize } from "../../localize";
import { openFolder, selectWorkspaceFolder } from "../../utils/workspaceUtils";

export async function createProject(): Promise<void> {
    const fsPath = await selectWorkspaceFolder(ext.ui);
    if (!fsPath) {
        return;
    }

    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicApp.creatingProject", "Creating project...")
    };

    await vscode.window.withProgress(options, async () => {
        await fse.ensureDir(fsPath);

        const uri = vscode.Uri.file(fsPath);
        await openFolder(uri);
    });
}
