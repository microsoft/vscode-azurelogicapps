/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Workflow } from "azure-arm-logic/lib/models";
import * as jsyaml from "js-yaml";
import { normalizeParameterName, normalizeResourceName } from "../stringUtils";
import { pathMatch } from "tough-cookie";

export interface IGenerateBuildDefinitionOptions {
    azureSubscription: string;
    csmFile: string;
    csmParametersFile: string;
    location: string;
    resourceGroupName: string;
}

export function generateBuildDefinition(options: IGenerateBuildDefinitionOptions): string {
    const { azureSubscription, csmFile, csmParametersFile, location, resourceGroupName } = options;

    const yaml = {
        resources: [
            {
                repo: "self"
            }
        ],
        pool: {
            name: "Hosted"
        },
        steps: [
            {
                task: "AzureResourceGroupDeployment@2",
                displayName: `Azure Deployment: Create Or Update Resource Group action on ${resourceGroupName}`,
                inputs: {
                    azureSubscription,
                    csmFile,
                    csmParametersFile,
                    location,
                    resourceGroupName
                }
            }
        ]
    };

    return jsyaml.safeDump(yaml);
}

export function generateDeploymentTemplate(parameters: Record<string, any>, resources: any[]) {
    return {
        $schema: "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        contentVersion: "1.0.0.0",
        parameters,
        resources,
        variables: {}
    };
}

export function generateDeploymentTemplateParameters(parameters: Record<string, any>) {
    return {
        $schema: "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        contentVersion: "1.0.0.0",
        parameters
    };
}

export function generateParameters(workflow: Workflow) {
    let parameters =  Object.assign({}, workflow.definition.parameters);

    for (var key in parameters) {
        // Rename parameters by appending `workflows_{workflow}` in front to avoid conflict of the same parameter name between multiple Logic Apps
        parameters[`workflows_${workflow.name}_parameters_${key}`] = {value: parameters[key].defaultValue};
        delete parameters[key];
    }

    return {
        $schema: "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        contentVersion: "1.0.0.0",
        parameters: {
            ...generateTemplateParameter(workflow.name!), ...parameters
        }
    };
}

export function generateTemplate(workflow: Workflow) {
    let parameters =  Object.assign({}, workflow.definition.parameters);

    for (var key in parameters) {
        // Rename parameters by appending `workflows_{workflow}` in front to avoid conflict of the same parameter name between multiple Logic Apps
        parameters[`workflows_${workflow.name}_parameters_${key}`] = parameters[key];
        delete parameters[key];
    }

    return {
        $schema: "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        contentVersion: "1.0.0.0",
        parameters: {
            ...generateTemplateParameterDefinition(workflow.name!), ...parameters
        },
        resources: [
            generateTemplateResource(workflow)
        ],
        variables: {}
    };
}

export function generateTemplateParameter(name: string) {
    const value = normalizeResourceName(name);
    const nameParameter = normalizeParameterName(`workflows_${name}_name`);

    return {
        [nameParameter]: {
            value
        }
    };
}

export function generateTemplateParameterDefinition(name: string) {
    const defaultValue = normalizeResourceName(name);
    const nameParameter = normalizeParameterName(`workflows_${name}_name`);

    return {
        [nameParameter]: {
            defaultValue,
            type: "string"
        }
    };
}

export function generateTemplateResource(workflow: Workflow) {
    const { definition, location, name } = workflow;
    const nameParameter = normalizeParameterName(`workflows_${name!}_name`);

    let parameters =  Object.assign({}, workflow.definition.parameters);

    for (var key in parameters) {
        parameters[key] = {value: `[parameters('workflows_${workflow.name}_parameters_${key}')]`};
    }

    return {
        apiVersion: "2017-07-01",
        dependsOn: [],
        location,
        name: `[parameters('${nameParameter}')]`,
        properties: {
            definition,
            parameters,
            state: "Enabled"
        },
        scale: null,
        tags: {},
        type: "Microsoft.Logic/workflows",
    };
}
