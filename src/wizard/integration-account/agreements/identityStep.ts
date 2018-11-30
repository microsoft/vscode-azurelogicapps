/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BusinessIdentity } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { UserCancelledError } from "vscode-azureextensionui";
import { Constants } from "../../../constants";
import { AgreementType } from "../../../utils/integration-account/agreementUtils";
import { getAllPartners } from "../../../utils/integration-account/partnerUtils";
import { arrayToMap } from "../../../utils/nodeUtils";
import { IAgreementWizardContext } from "./createAgreementWizard";

export class IdentityStep {
    public async prompt(wizardContext: IAgreementWizardContext, partnerName: string): Promise<BusinessIdentity> {
        if (!wizardContext.partners) {
            const partners = await getAllPartners(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);
            wizardContext.partners = arrayToMap(partners, "name");
        }

        const businessIdentities = wizardContext.partners.get(partnerName)!.content.b2b!.businessIdentities!;
        const filteredBusinessIdentities = this.filterBusinessIdentitiesForAgreementType(wizardContext.agreementType!, businessIdentities);
        const dropdownValues = filteredBusinessIdentities.map((businessIdentity) => {
            return `${businessIdentity.qualifier} : ${businessIdentity.value}`;
        });

        const selectedValue = await vscode.window.showQuickPick(dropdownValues);

        if (selectedValue) {
            const selectedIdentity = filteredBusinessIdentities.find((identity) => {
                return selectedValue.startsWith(identity.qualifier);
            });

            return selectedIdentity!;
        }

        throw new UserCancelledError();
    }

    private filterBusinessIdentitiesForAgreementType(agreementType: string, businessIdentities: BusinessIdentity[]): BusinessIdentity[] {
        let qualifiersToInclude: string[];

        if (agreementType === AgreementType.AS2) {
            qualifiersToInclude = Constants.AS2AllowedIdentityQualifiers;
        } else if (agreementType === AgreementType.X12) {
            qualifiersToInclude = Constants.X12AllowedIdentityQualifiers;
        } else {
            qualifiersToInclude = Constants.EdifactAllowedIdentityQualifiers;
        }

        return businessIdentities.filter((businessIdentity) => {
            return qualifiersToInclude.indexOf(businessIdentity.qualifier) > -1;
        });
    }
}
