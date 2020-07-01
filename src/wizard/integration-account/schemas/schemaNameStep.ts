/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountSchema } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { addExtensionUserAgent, AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../../localize";
import { ISchemaWizardContext } from "./createSchemaWizard";

export class SchemaNameStep extends AzureWizardPromptStep<ISchemaWizardContext> {
    public async prompt(wizardContext: ISchemaWizardContext): Promise<ISchemaWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azIntegrationAccounts.promptForSchemaName", "Enter a name for the new Schema."),
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

        const schemaName = await vscode.window.showInputBox(options);
        if (schemaName) {
            wizardContext.schemaName = schemaName.trim();
            return wizardContext;
        }

        throw new UserCancelledError();
    }

    private async isNameAvailable(name: string, wizardContext: ISchemaWizardContext): Promise<boolean> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.environment.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        let schemas = await client.integrationAccountSchemas.list(wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);
        let nextPageLink = schemas.nextLink;
        if (schemas.some((schema: IntegrationAccountSchema) => schema.name! === name)) {
            return false;
        }

        while (nextPageLink) {
            schemas = await client.integrationAccountSchemas.listNext(nextPageLink);
            if (schemas.some((schema: IntegrationAccountSchema) => schema.name! === name)) {
                return false;
            }

            nextPageLink = schemas.nextLink;
        }

        return true;
    }
}
