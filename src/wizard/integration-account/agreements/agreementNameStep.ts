/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountAgreement } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { addExtensionUserAgent, AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../../localize";
import { IAgreementWizardContext } from "./createAgreementWizard";

export class AgreementNameStep extends AzureWizardPromptStep<IAgreementWizardContext> {
    public async prompt(wizardContext: IAgreementWizardContext): Promise<IAgreementWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azIntegrationAccounts.promptForAgreementName", "Enter a name for the new Agreement."),
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

        const agreementName = await vscode.window.showInputBox(options);
        if (agreementName) {
            wizardContext.agreementName = agreementName.trim();
            return wizardContext;
        }

        throw new UserCancelledError();
    }

    private async isNameAvailable(name: string, wizardContext: IAgreementWizardContext): Promise<boolean> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.environment.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        let agreements = await client.integrationAccountAgreements.list(wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);
        let nextPageLink = agreements.nextLink;
        if (agreements.some((agreement: IntegrationAccountAgreement) => agreement.name! === name)) {
            return false;
        }

        while (nextPageLink) {
            agreements = await client.integrationAccountAgreements.listNext(nextPageLink);
            if (agreements.some((agreement: IntegrationAccountAgreement) => agreement.name! === name)) {
                return false;
            }

            nextPageLink = agreements.nextLink;
        }

        return true;
    }
}
