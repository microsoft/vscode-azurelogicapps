/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from "fs-extra";
import * as vscode from "vscode";
import { ext } from "../../extensionVariables";
import { openFolder, selectWorkspaceFolder } from "../../utils/workspaceUtils";

export async function createProject(): Promise<void> {
    const fsPath = await selectWorkspaceFolder(ext.ui);
    if (!fsPath) {
        return;
    }

    await fse.ensureDir(fsPath);

    const uri = vscode.Uri.file(fsPath);
    await openFolder(uri);
}
