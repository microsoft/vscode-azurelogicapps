/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from "path";
import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class CsmFilenameStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { workspaceFolderPath } = wizardContext;
        const csmFilename = await askForDeploymentTemplateFilename(workspaceFolderPath!);
        if (!csmFilename) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            csmFilename
        };
    }
}

async function askForDeploymentTemplateFilename(workspaceFolderPath: string): Promise<string | undefined> {
    const csmFileSaveDialogOptions: vscode.SaveDialogOptions = {
        defaultUri: vscode.Uri.file(path.join(workspaceFolderPath, "csm-file.json")),
        filters: {
            [localize("azLogicApps.armDeploymentTemplateFiles", "ARM Deployment Template Files")]: ["json"]
        }
    };
    const csmUri = await vscode.window.showSaveDialog(csmFileSaveDialogOptions);

    return csmUri ? csmUri.fsPath : undefined;
}
