/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { addExtensionUserAgent, AzureWizardPromptStep, ResourceGroupListStep, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { IAzureLogicAppWizardContext } from "./createLogicApp";

export class LogicAppNameStep extends AzureWizardPromptStep<IAzureLogicAppWizardContext> {
    public async prompt(wizardContext: IAzureLogicAppWizardContext): Promise<IAzureLogicAppWizardContext> {
        const options: vscode.InputBoxOptions = {
            prompt: localize("azLogicApps.promptForName", "Enter a name for the new Logic App."),
            validateInput: async (name: string) => {
                name = name ? name.trim() : "";

                if (!name) {
                    return localize("azLogicApps.nameRequired", "A name is required.");
                } else if (name.length > 80) {
                    return localize("azLogicApps.nameTooLong", "The name has a maximum length of 80 characters.");
                } else if (!/^[0-9a-zA-Z-_.()]+$/.test(name)) {
                    return localize("azLogicApps.nameContainsInvalidCharacters", "The name can only contain letters, numbers, and '-', '(', ')', '_', or '.'");
                } else if (!await this.isNameAvailable(name, wizardContext)) {
                    return localize("azLogicApps.nameAlreadyInUse", "The name is already in use.");
                } else {
                    return undefined;
                }
            }
        };

        const workflowName = await vscode.window.showInputBox(options);
        if (workflowName !== undefined) {
            wizardContext.workflowName = workflowName.trim();
        } else {
            throw new UserCancelledError();
        }

        return wizardContext;
    }

    protected async isRelatedNameAvailable(wizardContext: IAzureLogicAppWizardContext, name: string): Promise<boolean> {
        return ResourceGroupListStep.isNameAvailable(wizardContext, name);
    }

    private async isNameAvailable(name: string, wizardContext: IAzureLogicAppWizardContext): Promise<boolean> {
        let resourceGroupName: string;
        if (wizardContext.newResourceGroupName) {
            return true;
        } else {
            resourceGroupName = wizardContext.resourceGroup!.name!;
        }

        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.credentials.environment?.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        let workflows = await client.workflows.listByResourceGroup(resourceGroupName);
        let nextPageLink = workflows.nextLink;
        if (workflows.some((workflow: Workflow) => workflow.name! === name)) {
            return false;
        }

        while (nextPageLink !== undefined) {
            workflows = await client.workflows.listByResourceGroupNext(nextPageLink);
            if (workflows.some((workflow: Workflow) => workflow.name! === name)) {
                return false;
            }

            nextPageLink = workflows.nextLink;
        }

        return true;
    }
}
