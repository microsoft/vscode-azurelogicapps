/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BusinessIdentity, IntegrationAccount, IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { IntegrationAccountAgreementTreeItem } from "../../../tree/integration-account/IntegrationAccountAgreementTreeItem";
import { AgreementCreateStep } from "./agreementCreateStep";
import { AgreementNameStep } from "./agreementNameStep";
import { AgreementTypeStep } from "./agreementTypeStep";
import { GuestIdentityStep } from "./guestIdentityStep";
import { GuestPartnerStep } from "./guestPartnerStep";
import { HostIdentityStep } from "./hostIdentityStep";
import { HostPartnerStep } from "./hostPartnerStep";
import { IWizardContext } from "../../../models/wizard/wizard";

export interface IAgreementWizardContext extends IWizardContext {
    integrationAccountName: string;
    agreement?: IntegrationAccountAgreementTreeItem;
    agreementName?: string;
    agreementType?: string;
    hostPartner?: string;
    hostIdentity?: BusinessIdentity;
    guestPartner?: string;
    guestIdentity?: BusinessIdentity;

    // Passing Data Around
    partners?: Map<string, IntegrationAccountPartner>;
}

export async function runNewAgreementWizard(integrationAccount: IntegrationAccount, node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
    // Prompt the user for a agreement type and agreement name.
    const promptSteps: Array<AzureWizardPromptStep<IAgreementWizardContext>> = [
        new AgreementTypeStep(),
        new AgreementNameStep(),
        new HostPartnerStep(),
        new HostIdentityStep(),
        new GuestPartnerStep(),
        new GuestIdentityStep()
    ];

    // Create the new Agreement.
    const executeSteps: Array<AzureWizardExecuteStep<IAgreementWizardContext>> = [
        new AgreementCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: IAgreementWizardContext = {
        credentials: node.credentials,
        integrationAccountName: integrationAccount.name!,
        resourceGroup: {
            location: integrationAccount.location!,
            name: integrationAccount.id!.split("/").slice(-5, -4)[0]
        },
        subscriptionDisplayName: node.subscriptionDisplayName,
        subscriptionId: node.subscriptionId
    };

    // Create a new instance of an Azure wizard for creating Agreements.
    const wizard = new AzureWizard<IAgreementWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a new Agreements.
    wizardContext = await wizard.prompt(actionContext);

    // Show a "Creating..." message in the tree view.
    showCreatingNode(wizardContext.agreementName!);

    // Execute the necessary steps to create a new Agreement.
    wizardContext = await wizard.execute(actionContext);

    // Return a new Agreement tree item to add to the tree view.
    return wizardContext.agreement!;
}
