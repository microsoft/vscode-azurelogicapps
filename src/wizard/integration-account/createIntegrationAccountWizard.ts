/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AzureEnvironment } from "ms-rest-azure";
import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext, IAzureNode, IAzureTreeItem, ILocationWizardContext, IResourceGroupWizardContext, LocationListStep, ResourceGroupCreateStep, ResourceGroupListStep } from "vscode-azureextensionui";
import { IntegrationAccountTreeItem } from "../../tree/integration-account/IntegrationAccountTreeItem";
import { IntegrationAccountCreateStep } from "./integrationAccountCreateStep";
import { IntegrationAccountNameStep } from "./integrationAccountNameStep";
import { IntegrationAccountSkuStep } from "./integrationAccountSkuStep";

export interface IIntegrationAccountWizardContext extends ILocationWizardContext, IResourceGroupWizardContext {
    integrationAccount?: IntegrationAccountTreeItem;
    integrationAccountName?: string;
    sku?: string;
    environment: AzureEnvironment;
}

export async function runNewIntegrationAccountWizard(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
    // Prompt the user for a integration account name, resource group, location, and sku.
    const promptSteps: Array<AzureWizardPromptStep<IIntegrationAccountWizardContext>> = [
        new ResourceGroupListStep(),
        new LocationListStep(),
        new IntegrationAccountNameStep(),
        new IntegrationAccountSkuStep()
    ];

    // Create a new resource group (if necessary) and the new Integration Account.
    const executeSteps: Array<AzureWizardExecuteStep<IIntegrationAccountWizardContext>> = [
        new ResourceGroupCreateStep(),
        new IntegrationAccountCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: IIntegrationAccountWizardContext = {
        credentials: node.credentials,
        subscriptionDisplayName: node.subscriptionDisplayName,
        subscriptionId: node.subscriptionId,
        environment: node.environment
    };

    // Create a new instance of an Azure wizard for creating Integration Accounts.
    const wizard = new AzureWizard<IIntegrationAccountWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a new Integration Account.
    wizardContext = await wizard.prompt(actionContext);

    // Show a "Creating..." message in the tree view.
    showCreatingNode(wizardContext.integrationAccountName!);

    // Execute the necessary steps to create a new Integration Account.
    wizardContext = await wizard.execute(actionContext);

    // Return a new Integration Account tree item to add to the tree view.
    return wizardContext.integrationAccount!;
}
