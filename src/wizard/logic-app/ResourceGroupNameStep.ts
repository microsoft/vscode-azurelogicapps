/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class ResourceGroupNameStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const resourceGroupName = await askForResourceGroupName();
        if (!resourceGroupName) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            resourceGroupName
        };
    }
}

async function askForResourceGroupName(): Promise<string | undefined> {
    function validateInput(value: string): string | null | undefined | Thenable<string | null | undefined> {
        if (value === "") {
            return localize("azLogicApps.resourceGroupNameRequired", "A resource group name is required.");
        } else if (value.length > 90) {
            return localize("azLogicApps.resourceGroupNameTooLong", "A resource group name can only have 90 characters or less.");
        } else if (/[^-\w.()]/g.test(value)) {
            return localize("azLogicApps.resourceGroupNameValidCharacters", "A resource group name can only have alphanumeric characters, underscores, dashes, periods, and parentheses.");
        } else if (/\.$/.test(value)) {
            return localize("azLogicApps.resourceGroupNameCannotEndInPeriod", "A resource group name cannot end with a period.");
        }

        return undefined;
    }

    const resourceGroupNameInputBoxOptions: vscode.InputBoxOptions = {
        prompt: localize("azLogicApps.resourceGroupNamePrompt", "Enter the name of the resource group."),
        validateInput
    };

    return vscode.window.showInputBox(resourceGroupNameInputBoxOptions);
}
