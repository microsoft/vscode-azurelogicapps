/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext, IAzureNode, IAzureTreeItem, ILocationWizardContext, IResourceGroupWizardContext, LocationListStep, ResourceGroupCreateStep, ResourceGroupListStep } from "vscode-azureextensionui";
import { LogicAppTreeItem } from "../../tree/logic-app/LogicAppTreeItem";
import { LogicAppCreateStep } from "./LogicAppCreateStep";
import { LogicAppNameStep } from "./LogicAppNameStep";

export interface IAzureLogicAppWizardContext extends ILocationWizardContext, IResourceGroupWizardContext {
    logicApp?: LogicAppTreeItem;
    workflowName?: string;
}

export async function createLogicApp(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
    // Prompt the user for a workflow name, resource group, and location.
    const promptSteps: Array<AzureWizardPromptStep<IAzureLogicAppWizardContext>> = [
        new ResourceGroupListStep(),
        new LocationListStep(),
        new LogicAppNameStep()
    ];

    // Create a new resource group (if necessary) and the new Logic App.
    const executeSteps: Array<AzureWizardExecuteStep<IAzureLogicAppWizardContext>> = [
        new ResourceGroupCreateStep(),
        new LogicAppCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: IAzureLogicAppWizardContext = {
        credentials: node.credentials,
        subscriptionDisplayName: node.subscriptionDisplayName,
        subscriptionId: node.subscriptionId
    };

    // Create a new instance of an Azure wizard for creating Logic Apps.
    const wizard = new AzureWizard<IAzureLogicAppWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a new Logic App.
    wizardContext = await wizard.prompt(actionContext);

    // Show a "Creating..." message in the tree view.
    showCreatingNode(wizardContext.workflowName!);

    // Execute the necessary steps to create a new Logic App.
    wizardContext = await wizard.execute(actionContext);

    // Return a new Logic App tree item to add to the tree view.
    return wizardContext.logicApp!;
}
