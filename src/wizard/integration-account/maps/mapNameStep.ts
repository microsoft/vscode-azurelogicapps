/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountMap } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { addExtensionUserAgent, AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../../localize";
import { IMapWizardContext } from "./createMapWizard";

export class MapNameStep extends AzureWizardPromptStep<IMapWizardContext> {
    public async prompt(wizardContext: IMapWizardContext): Promise<IMapWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azIntegrationAccounts.promptForMapName", "Enter a name for the new Map."),
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

        const mapName = await vscode.window.showInputBox(options);
        if (mapName) {
            wizardContext.mapName = mapName.trim();
            return wizardContext;
        }

        throw new UserCancelledError();
    }

    private async isNameAvailable(name: string, wizardContext: IMapWizardContext): Promise<boolean> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId);
        addExtensionUserAgent(client);

        let maps = await client.maps.listByIntegrationAccounts(wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);
        let nextPageLink = maps.nextLink;
        if (maps.some((map: IntegrationAccountMap) => map.name! === name)) {
            return false;
        }

        while (nextPageLink) {
            maps = await client.maps.listByIntegrationAccountsNext(nextPageLink);
            if (maps.some((map: IntegrationAccountMap) => map.name! === name)) {
                return false;
            }

            nextPageLink = maps.nextLink;
        }

        return true;
    }
}
