/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from "path";
import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class BuildDefinitionFilenameStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { workspaceFolderPath } = wizardContext;
        const buildDefinitionFilename = await askForBuildDefinitionFilename(workspaceFolderPath!);
        if (!buildDefinitionFilename) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            buildDefinitionFilename
        };
    }
}

async function askForBuildDefinitionFilename(workspaceFolderPath: string): Promise<string | undefined> {
    const yamlSaveDialogOptions: vscode.SaveDialogOptions = {
        defaultUri: vscode.Uri.file(path.join(workspaceFolderPath, "azure-pipelines.yml")),
        filters: {
            [localize("azLogicApps.azurePipelinesYamlFiles", "Azure Pipelines YAML Files")]: ["yml"]
        }
    };
    const yamlUri = await vscode.window.showSaveDialog(yamlSaveDialogOptions);

    return yamlUri ? yamlUri.fsPath : undefined;
}
