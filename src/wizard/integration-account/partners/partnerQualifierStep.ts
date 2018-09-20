/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { Constants } from "../../../constants";
import { IPartnerWizardContext } from "./createPartnerWizard";

export class PartnerQualifierStep extends AzureWizardPromptStep<IPartnerWizardContext> {
    public async prompt(wizardContext: IPartnerWizardContext): Promise<IPartnerWizardContext> {
        const qualifiers = Array.from(Constants.Qualifier.keys());
        const qualifier = await vscode.window.showQuickPick(qualifiers);

        if (qualifier) {
            wizardContext.partnerQualifier = Constants.Qualifier.get(qualifier);
            return wizardContext;
        }

        throw new UserCancelledError();
    }
}
