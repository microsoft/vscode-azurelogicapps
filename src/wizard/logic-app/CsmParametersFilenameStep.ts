/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from "path";
import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class CsmParametersFilenameStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { workspaceFolderPath } = wizardContext;
        const csmParametersFilename = await askForDeploymentTemplateParametersFilename(workspaceFolderPath!);
        if (!csmParametersFilename) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            csmParametersFilename
        };
    }
}

async function askForDeploymentTemplateParametersFilename(workspaceFolderPath: string): Promise<string | undefined> {
    const csmParametersFileSaveDialogOptions: vscode.SaveDialogOptions = {
        defaultUri: vscode.Uri.file(path.join(workspaceFolderPath, "csm-parameters-file.json")),
        filters: {
            [localize("azLogicApps.armDeploymentTemplateParametersFiles", "ARM Deployment Template Parameters Files")]: ["json"]
        }
    };
    const csmParametersUri = await vscode.window.showSaveDialog(csmParametersFileSaveDialogOptions);

    return csmParametersUri ? csmParametersUri.fsPath : undefined;
}
