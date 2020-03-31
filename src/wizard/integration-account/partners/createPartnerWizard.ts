/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureEnvironment } from "ms-rest-azure";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext, IAzureNode, IAzureTreeItem, ILocationWizardContext, IResourceGroupWizardContext } from "vscode-azureextensionui";
import { IntegrationAccountPartnerTreeItem } from "../../../tree/integration-account/IntegrationAccountPartnerTreeItem";
import { PartnerCreateStep } from "./partnerCreateStep";
import { PartnerNameStep } from "./partnerNameStep";
import { PartnerQualifierStep } from "./partnerQualifierStep";
import { PartnerValueStep } from "./partnerValueStep";

export interface IPartnerWizardContext extends ILocationWizardContext, IResourceGroupWizardContext {
    integrationAccountName: string;
    partner?: IntegrationAccountPartnerTreeItem;
    partnerName?: string;
    partnerQualifier?: string;
    partnerValue?: string;
    environment: AzureEnvironment;
}

export async function runNewPartnerWizard(integrationAccount: IntegrationAccount, node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
    // Prompt the user for a partner name and a business identity.
    const promptSteps: Array<AzureWizardPromptStep<IPartnerWizardContext>> = [
        new PartnerNameStep(),
        new PartnerQualifierStep(),
        new PartnerValueStep()
    ];

    // Create the new Partner.
    const executeSteps: Array<AzureWizardExecuteStep<IPartnerWizardContext>> = [
        new PartnerCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: IPartnerWizardContext = {
        credentials: node.credentials,
        integrationAccountName: integrationAccount.name!,
        resourceGroup: {
            location: integrationAccount.location!,
            name: integrationAccount.id!.split("/").slice(-5, -4)[0]
        },
        subscriptionDisplayName: node.subscriptionDisplayName,
        subscriptionId: node.subscriptionId,
        environment: node.environment
    };

    // Create a new instance of an Azure wizard for creating Partners.
    const wizard = new AzureWizard<IPartnerWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a new Partners.
    wizardContext = await wizard.prompt(actionContext);

    // Show a "Creating..." message in the tree view.
    showCreatingNode(wizardContext.partnerName!);

    // Execute the necessary steps to create a new Partner.
    wizardContext = await wizard.execute(actionContext);

    // Return a new Partner tree item to add to the tree view.
    return wizardContext.partner!;
}
