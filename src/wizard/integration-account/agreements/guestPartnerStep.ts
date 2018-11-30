/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep } from "vscode-azureextensionui";
import { IAgreementWizardContext } from "./createAgreementWizard";
import { PartnerStep } from "./partnerStep";

export class GuestPartnerStep extends AzureWizardPromptStep<IAgreementWizardContext> {
    public async prompt(wizardContext: IAgreementWizardContext): Promise<IAgreementWizardContext> {
        const partnerStep = new PartnerStep();
        await partnerStep.prompt(wizardContext, [wizardContext.hostPartner!]).then((result) => {
            wizardContext.guestPartner = result;
        });

        return wizardContext;
    }
}
