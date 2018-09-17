/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, AzureWizardExecuteStep } from "vscode-azureextensionui";
import { IntegrationAccountPartnerTreeItem } from "../../../tree/integration-account/IntegrationAccountPartnerTreeItem";
import { createNewPartner } from "../../../utils/integration-account/partnerUtils";
import { IPartnerWizardContext } from "./createPartnerWizard";

export class PartnerCreateStep extends AzureWizardExecuteStep<IPartnerWizardContext> {
    public async execute(wizardContext: IPartnerWizardContext): Promise<IPartnerWizardContext> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId);
        addExtensionUserAgent(client);

        const newPartner: IntegrationAccountPartner = await client.integrationAccountPartners.createOrUpdate(wizardContext.resourceGroup!.name!,
            wizardContext.integrationAccountName,
            wizardContext.partnerName!,
            await createNewPartner(wizardContext.partnerName!, wizardContext.partnerQualifier!, wizardContext.partnerValue!));

        wizardContext.partner = new IntegrationAccountPartnerTreeItem(client, newPartner);

        return wizardContext;
    }
}
