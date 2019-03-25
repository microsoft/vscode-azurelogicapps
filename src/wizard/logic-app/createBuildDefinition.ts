/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizard, AzureWizardExecuteStep, AzureWizardPromptStep, IActionContext } from "vscode-azureextensionui";
import { BuildDefinitionCreateStep } from "./BuildDefinitionCreateStep";
import { BuildDefinitionFilenameStep } from "./BuildDefinitionFilenameStep";
import { CsmFileCreateStep } from "./CsmFileCreateStep";
import { CsmFilenameStep } from "./CsmFilenameStep";
import { CsmParametersFileCreateStep } from "./CsmParametersFileCreateStep";
import { CsmParametersFilenameStep } from "./CsmParametersFilenameStep";
import { GenerateBuildDefinitionStep } from "./GenerateBuildDefinitionStep";
import { LocationListStep } from "./LocationListStep";
import { ResourceGroupNameStep } from "./ResourceGroupNameStep";
import { ServiceConnectionNameStep } from "./ServiceConnectionNameStep";
import { WorkspaceFolderSelectionStep } from "./WorkspaceFolderSelectionStep";

export interface IBuildDefinitionWizardContext {
    azureSubscription?: string;
    buildDefinitionFilename?: string;
    csmFilename?: string;
    csmParametersFilename?: string;
    location?: string;
    resourceGroupName?: string;
    templateParameterDefinitions: Record<string, any>;
    templateParameters: Record<string, any>;
    templateResources: any[];
    workspaceFolderPath?: string;
}

export async function createBuildDefinition(workspaceFolderPath?: string): Promise<IBuildDefinitionWizardContext> {
    // Prompt the user for an Azure DevOps ARM service connection, resource group, location, deployment template filename, deployment template parameters filename, and build definition filename.
    const promptSteps: Array<AzureWizardPromptStep<IBuildDefinitionWizardContext>> = [
        new WorkspaceFolderSelectionStep(),
        new ServiceConnectionNameStep(),
        new ResourceGroupNameStep(),
        new LocationListStep(),
        new CsmFilenameStep(),
        new CsmParametersFilenameStep(),
        new BuildDefinitionFilenameStep()
    ];

    // Create a deployment template, a deployment template parameters file, and a build definition.
    const executeSteps: Array<AzureWizardExecuteStep<IBuildDefinitionWizardContext>> = [
        new GenerateBuildDefinitionStep(),
        new CsmFileCreateStep(),
        new CsmParametersFileCreateStep(),
        new BuildDefinitionCreateStep()
    ];

    // Initialize the wizard context.
    let wizardContext: IBuildDefinitionWizardContext = {
        templateParameterDefinitions: {},
        templateParameters: {},
        templateResources: [],
        workspaceFolderPath
    };

    // Create a new instance of an Azure wizard for creating build definitions.
    const wizard = new AzureWizard<IBuildDefinitionWizardContext>(promptSteps, executeSteps, wizardContext);

    // Create a fake action context until https://github.com/Microsoft/vscode-azuretools/issues/120 is fixed.
    const actionContext = { measurements: {}, properties: {} } as IActionContext;

    // Prompt the user for information required to create a build definition.
    wizardContext = await wizard.prompt(actionContext);

    // Execute the necessary steps to create a build definition.
    wizardContext = await wizard.execute(actionContext);

    return wizardContext;
}
