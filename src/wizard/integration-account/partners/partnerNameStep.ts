/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../../localize";
import { getAllPartners } from "../../../utils/integration-account/partnerUtils";
import { IPartnerWizardContext } from "./createPartnerWizard";

export class PartnerNameStep extends AzureWizardPromptStep<IPartnerWizardContext> {
    public async prompt(wizardContext: IPartnerWizardContext): Promise<IPartnerWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azIntegrationAccounts.promptForPartnerName", "Enter a name for the new Partner."),
            validateInput: async (name: string) => {
                name = name ? name.trim() : "";

                if (!name) {
                    return localize("azIntegrationAccounts.nameRequired", "A name is required.");
                } else if (name.length > 80) {
                    return localize("azIntegrationAccounts.nameTooLong", "The name has a maximum length of 80 characters.");
                } else if (!/^[0-9a-zA-Z-_.()]+$/.test(name)) {
                    return localize("azIntegrationAccounts.nameContainsInvalidCharacters", "The name can only contain letters, numbers, and '-', '(', ')', '_', or '.'");
                } else if (!await this.isNameAvailable(name, wizardContext)) {
                    return localize("azIntegrationAccounts.nameAlreadyInUse", "The name is already in use.");
                } else {
                    return undefined;
                }
            }
        };

        const partnerName = await vscode.window.showInputBox(options);
        if (partnerName) {
            wizardContext.partnerName = partnerName.trim();
            return wizardContext;
        }

        throw new UserCancelledError();
    }

    private async isNameAvailable(name: string, wizardContext: IPartnerWizardContext): Promise<boolean> {
        const partners = await getAllPartners(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);

        if (partners.some((partner: IntegrationAccountPartner) => partner.name! === name)) {
            return false;
        }

        return true;
    }
}
