/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { UserCancelledError } from "vscode-azureextensionui";
import { getAllPartners } from "../../../utils/integration-account/partnerUtils";
import { arrayToMap } from "../../../utils/nodeUtils";
import { IAgreementWizardContext } from "./createAgreementWizard";

export class PartnerStep {
    public async prompt(wizardContext: IAgreementWizardContext, namesToExclude: string[] = []): Promise<string> {
        let partnerNames: string[];
        if (!wizardContext.partners) {
            const partners = await getAllPartners(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.resourceGroup!.name!, wizardContext.integrationAccountName);
            wizardContext.partners = arrayToMap(partners, "name");
        }

        partnerNames = [...wizardContext.partners.keys()];
        partnerNames = partnerNames.filter((partnerName) => {
            return namesToExclude.indexOf(partnerName) === -1;
        });

        const selectedPartner = await vscode.window.showQuickPick(partnerNames);

        if (selectedPartner) {
            return selectedPartner;
        }

        throw new UserCancelledError();
    }
}
