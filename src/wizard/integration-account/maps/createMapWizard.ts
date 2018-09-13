/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext, IAzureNode, IAzureTreeItem, ILocationWizardContext, IResourceGroupWizardContext } from "vscode-azureextensionui";
import { IntegrationAccountMapTreeItem } from "../../../tree/integration-account/IntegrationAccountMapTreeItem";
import { MapCreateStep } from "./mapCreateStep";
import { MapNameStep } from "./mapNameStep";
import { MapTypeStep } from "./mapTypeStep";

export interface IMapWizardContext extends ILocationWizardContext, IResourceGroupWizardContext {
    integrationAccountName: string;
    map?: IntegrationAccountMapTreeItem;
    mapName?: string;
    mapType?: string;
}

export async function runNewMapWizard(integrationAccount: IntegrationAccount, node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
    // Prompt the user for a map type and map name.
    const promptSteps: Array<AzureWizardPromptStep<IMapWizardContext>> = [
        new MapTypeStep(),
        new MapNameStep()
    ];

    // Create the new Map.
    const executeSteps: Array<AzureWizardExecuteStep<IMapWizardContext>> = [
        new MapCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: IMapWizardContext = {
        credentials: node.credentials,
        integrationAccountName: integrationAccount.name!,
        resourceGroup: {
            location: integrationAccount.location!,
            name: integrationAccount.id!.split("/").slice(-5, -4)[0]
        },
        subscriptionDisplayName: node.subscriptionDisplayName,
        subscriptionId: node.subscriptionId
    };

    // Create a new instance of an Azure wizard for creating Maps.
    const wizard = new AzureWizard<IMapWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a new Maps.
    wizardContext = await wizard.prompt(actionContext);

    // Show a "Creating..." message in the tree view.
    showCreatingNode(wizardContext.mapName!);

    // Execute the necessary steps to create a new Map.
    wizardContext = await wizard.execute(actionContext);

    // Return a new Map tree item to add to the tree view.
    return wizardContext.map!;
}
