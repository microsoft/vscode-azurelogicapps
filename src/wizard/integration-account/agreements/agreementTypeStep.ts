/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { AgreementType } from "../../../utils/integration-account/agreementUtils";
import { IAgreementWizardContext } from "./createAgreementWizard";

export class AgreementTypeStep extends AzureWizardPromptStep<IAgreementWizardContext> {
    public async prompt(wizardContext: IAgreementWizardContext): Promise<IAgreementWizardContext> {
        const agreementTypes = Object.keys(AgreementType);
        wizardContext.agreementType = await vscode.window.showQuickPick(agreementTypes);

        if (wizardContext.agreementType) {
            return wizardContext;
        }

        throw new UserCancelledError();
    }
}
