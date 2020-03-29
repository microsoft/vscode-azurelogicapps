/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, AzureWizardExecuteStep } from "vscode-azureextensionui";
import { IntegrationAccountTreeItem } from "../../tree/integration-account/IntegrationAccountTreeItem";
import { createNewIntegrationAccount, IntegrationAccountSku } from "../../utils/integration-account/integrationAccountUtils";
import { IIntegrationAccountWizardContext } from "./createIntegrationAccountWizard";

export class IntegrationAccountCreateStep extends AzureWizardExecuteStep<IIntegrationAccountWizardContext> {
    public async execute(wizardContext: IIntegrationAccountWizardContext): Promise<IIntegrationAccountWizardContext> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.credentials.environment?.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        const newIntegrationAccount: IntegrationAccount = await client.integrationAccounts.createOrUpdate(wizardContext.resourceGroup!.name!,
            wizardContext.integrationAccountName!,
            await createNewIntegrationAccount(wizardContext.integrationAccountName!,
                IntegrationAccountSku[wizardContext.sku! as IntegrationAccountSku],
                wizardContext.location!.name!));

        wizardContext.integrationAccount = new IntegrationAccountTreeItem(client, newIntegrationAccount);

        return wizardContext;
    }
}
