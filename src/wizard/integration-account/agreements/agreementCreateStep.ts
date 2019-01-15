/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountAgreement } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, AzureWizardExecuteStep } from "vscode-azureextensionui";
import { IntegrationAccountAgreementTreeItem } from "../../../tree/integration-account/IntegrationAccountAgreementTreeItem";
import { AgreementType, createNewAgreement } from "../../../utils/integration-account/agreementUtils";
import { IAgreementWizardContext } from "./createAgreementWizard";

export class AgreementCreateStep extends AzureWizardExecuteStep<IAgreementWizardContext> {
    public async execute(wizardContext: IAgreementWizardContext): Promise<IAgreementWizardContext> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId);
        addExtensionUserAgent(client);

        const newAgreement: IntegrationAccountAgreement = await client.integrationAccountAgreements.createOrUpdate(wizardContext.resourceGroup!.name!,
            wizardContext.integrationAccountName,
            wizardContext.agreementName!,
            await createNewAgreement(wizardContext.agreementName!,
                                    AgreementType[wizardContext.agreementType! as AgreementType],
                                    wizardContext.hostPartner!,
                                    wizardContext.hostIdentity!,
                                    wizardContext.guestPartner!,
                                    wizardContext.guestIdentity!));

        wizardContext.agreement = new IntegrationAccountAgreementTreeItem(client, newAgreement);

        return wizardContext;
    }
}
