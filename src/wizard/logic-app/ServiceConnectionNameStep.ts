/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class ServiceConnectionNameStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const azureSubscription = await askForAzureSubscriptionName();
        if (!azureSubscription) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            azureSubscription
        };
    }
}

async function askForAzureSubscriptionName(): Promise<string | undefined> {
    function validateInput(value: string): string | null | undefined | Thenable<string | null | undefined> {
        if (value === "") {
            return localize("azLogicApps.azureSubscriptionRequired", "An ARM service connection name is required.");
        }

        return undefined;
    }

    const azureSubscriptionInputBoxOptions: vscode.InputBoxOptions = {
        prompt: localize("azLogicApps.azureSubscriptionPrompt", "Enter Azure Resource Manager connection name."),
        validateInput
    };

    return vscode.window.showInputBox(azureSubscriptionInputBoxOptions);
}
