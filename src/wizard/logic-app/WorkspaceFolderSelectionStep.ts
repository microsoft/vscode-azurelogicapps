/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { ext } from "../../extensionVariables";
import { selectWorkspaceFolder } from "../../utils/workspaceUtils";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class WorkspaceFolderSelectionStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const workspaceFolderPath = wizardContext.workspaceFolderPath || await selectWorkspaceFolder(ext.ui);
        if (!workspaceFolderPath) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            workspaceFolderPath
        };
    }
}
