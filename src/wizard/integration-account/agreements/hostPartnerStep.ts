/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep } from "vscode-azureextensionui";
import { IAgreementWizardContext } from "./createAgreementWizard";
import { PartnerStep } from "./partnerStep";

export class HostPartnerStep extends AzureWizardPromptStep<IAgreementWizardContext> {
    public async prompt(wizardContext: IAgreementWizardContext): Promise<IAgreementWizardContext> {
        const partnerStep = new PartnerStep();
        await partnerStep.prompt(wizardContext).then((result) => {
            wizardContext.hostPartner = result;
        });

        return wizardContext;
    }
}
