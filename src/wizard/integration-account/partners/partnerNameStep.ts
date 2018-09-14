/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { addExtensionUserAgent, AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../../localize";
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
                    return null;
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
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId);
        addExtensionUserAgent(client);

        let partners = await client.integrationAccountPartners.list(wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);
        let nextPageLink = partners.nextLink;
        if (partners.some((partner: IntegrationAccountPartner) => partner.name! === name)) {
            return false;
        }

        while (nextPageLink) {
            partners = await client.integrationAccountPartners.listNext(nextPageLink);
            if (partners.some((partner: IntegrationAccountPartner) => partner.name! === name)) {
                return false;
            }

            nextPageLink = partners.nextLink;
        }

        return true;
    }
}
