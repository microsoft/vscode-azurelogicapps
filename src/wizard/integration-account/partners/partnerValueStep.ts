/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../../localize";
import { IPartnerWizardContext } from "./createPartnerWizard";

export class PartnerValueStep extends AzureWizardPromptStep<IPartnerWizardContext> {
    public async prompt(wizardContext: IPartnerWizardContext): Promise<IPartnerWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azIntegrationAccounts.promptForPartnerName", "Enter a value for the qualifier."),
            validateInput: async (value: string) => {
                value = value ? value.trim() : "";

                if (!value) {
                    return localize("azIntegrationAccounts.valueRequired", "A value is required.");
                } else if (value.length > 128) {
                    return localize("azIntegrationAccounts.valueTooLong", "The value has a maximum length of 128 characters.");
                } else if (!/^\"?[a-zA-Z0-9\-_.() ]+\"?$/.test(value)) {
                    return localize("azIntegrationAccounts.valueContainsInvalidCharacters", "The value can only contain letters, numbers, and '-', '(', ')', '_', or '.'");
                } else {
                    return null;
                }
            }
        };

        const partnerValue = await vscode.window.showInputBox(options);
        if (partnerValue) {
            wizardContext.partnerValue = partnerValue.trim();
            return wizardContext;
        }

        throw new UserCancelledError();
    }
}
