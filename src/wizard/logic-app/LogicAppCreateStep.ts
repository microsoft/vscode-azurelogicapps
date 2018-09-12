/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, AzureWizardExecuteStep } from "vscode-azureextensionui";
import { LogicAppTreeItem } from "../../tree/logic-app/LogicAppTreeItem";
import { IAzureLogicAppWizardContext } from "./createLogicApp";

export class LogicAppCreateStep extends AzureWizardExecuteStep<IAzureLogicAppWizardContext> {
    public async execute(wizardContext: IAzureLogicAppWizardContext): Promise<IAzureLogicAppWizardContext> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId);
        addExtensionUserAgent(client);

        const location = wizardContext.location!.name!;
        const resourceGroupName = wizardContext.resourceGroup!.name!;
        const workflowName = wizardContext.workflowName!;
        const emptyWorkflow: Workflow = {
            definition: {
                $schema: "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
                actions: {},
                contentVersion: "1.0.0.0",
                outputs: {},
                parameters: {},
                triggers: {}
            },
            location
        };
        const workflow = await client.workflows.createOrUpdate(resourceGroupName, workflowName, emptyWorkflow);

        wizardContext.logicApp = new LogicAppTreeItem(client, workflow);

        return wizardContext;
    }
}
