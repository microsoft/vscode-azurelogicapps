/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { addExtensionUserAgent, AzureWizardPromptStep, ResourceGroupListStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IIntegrationAccountWizardContext } from "./createIntegrationAccountWizard";

export class IntegrationAccountNameStep extends AzureWizardPromptStep<IIntegrationAccountWizardContext> {
    public async prompt(wizardContext: IIntegrationAccountWizardContext): Promise<IIntegrationAccountWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azIntegrationAccounts.promptForName", "Enter a name for the new Integration Account."),
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

        const integrationAccountName = await vscode.window.showInputBox(options);
        if (integrationAccountName) {
            wizardContext.integrationAccountName = integrationAccountName.trim();
            return wizardContext;
        }

        throw new UserCancelledError();
    }

    protected async isRelatedNameAvailable(wizardContext: IIntegrationAccountWizardContext, name: string): Promise<boolean> {
        return ResourceGroupListStep.isNameAvailable(wizardContext, name);
    }

    private async isNameAvailable(name: string, wizardContext: IIntegrationAccountWizardContext): Promise<boolean> {
        let resourceGroupName: string;
        if (wizardContext.newResourceGroupName) {
            return true;
        } else {
            resourceGroupName = wizardContext.resourceGroup!.name!;
        }

        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.credentials.environment?.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        let integrationAccounts = await client.integrationAccounts.listByResourceGroup(resourceGroupName);
        let nextPageLink = integrationAccounts.nextLink;
        if (integrationAccounts.some((integrationAccount: IntegrationAccount) => integrationAccount.name! === name)) {
            return false;
        }

        while (nextPageLink) {
            integrationAccounts = await client.integrationAccounts.listByResourceGroupNext(nextPageLink);
            if (integrationAccounts.some((integrationAccount: IntegrationAccount) => integrationAccount.name! === name)) {
                return false;
            }

            nextPageLink = integrationAccounts.nextLink;
        }

        return true;
    }
}
