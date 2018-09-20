/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { IntegrationAccountSku } from "../../utils/integration-account/integrationAccountUtils";
import { IIntegrationAccountWizardContext } from "./createIntegrationAccountWizard";

export class IntegrationAccountSkuStep extends AzureWizardPromptStep<IIntegrationAccountWizardContext> {
    public async prompt(wizardContext: IIntegrationAccountWizardContext): Promise<IIntegrationAccountWizardContext> {
        const skus = Object.keys(IntegrationAccountSku);
        wizardContext.sku = await vscode.window.showQuickPick(skus);

        if (wizardContext.sku) {
            return wizardContext;
        }

        throw new UserCancelledError();
    }
}
