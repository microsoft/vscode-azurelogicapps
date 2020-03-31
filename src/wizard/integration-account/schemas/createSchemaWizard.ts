/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureEnvironment } from "ms-rest-azure";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext, IAzureNode, IAzureTreeItem, ILocationWizardContext, IResourceGroupWizardContext } from "vscode-azureextensionui";
import { IntegrationAccountSchemaTreeItem } from "../../../tree/integration-account/IntegrationAccountSchemaTreeItem";
import { SchemaCreateStep } from "./schemaCreateStep";
import { SchemaNameStep } from "./schemaNameStep";

export interface ISchemaWizardContext extends ILocationWizardContext, IResourceGroupWizardContext {
    integrationAccountName: string;
    schema?: IntegrationAccountSchemaTreeItem;
    schemaName?: string;
    environment: AzureEnvironment;
}

export async function runNewSchemaWizard(integrationAccount: IntegrationAccount, node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
    // Prompt the user for a schema type and schema name.
    const promptSteps: Array<AzureWizardPromptStep<ISchemaWizardContext>> = [
        new SchemaNameStep()
    ];

    // Create the new Schema.
    const executeSteps: Array<AzureWizardExecuteStep<ISchemaWizardContext>> = [
        new SchemaCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: ISchemaWizardContext = {
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

    // Create a new instance of an Azure wizard for creating Schemas.
    const wizard = new AzureWizard<ISchemaWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a new Schemas.
    wizardContext = await wizard.prompt(actionContext);

    // Show a "Creating..." message in the tree view.
    showCreatingNode(wizardContext.schemaName!);

    // Execute the necessary steps to create a new Schema.
    wizardContext = await wizard.execute(actionContext);

    // Return a new Schema tree item to add to the tree view.
    return wizardContext.schema!;
}
