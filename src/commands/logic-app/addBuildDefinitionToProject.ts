/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { openFolder } from "../../utils/workspaceUtils";
import { createBuildDefinition } from "../../wizard/logic-app/createBuildDefinition";

export async function addBuildDefinitionToProject(workspaceFolderPath?: string): Promise<void> {
    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicApps.creatingBuildDefinition", "Creating build definition...")
    };

    await vscode.window.withProgress(options, async () => {
        ({ workspaceFolderPath } = await createBuildDefinition(workspaceFolderPath));

        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            await openFolder(vscode.Uri.file(workspaceFolderPath!));
        }
    });
}
