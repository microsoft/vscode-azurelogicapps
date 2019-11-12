/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Workflow } from "azure-arm-logic/lib/models";
import * as fse from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { AzureWizardExecuteStep } from "vscode-azureextensionui";
import { generateParameters, generateTemplate, generateTemplateResource } from "../../utils/logic-app/templateUtils";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class GenerateBuildDefinitionStep extends AzureWizardExecuteStep<IBuildDefinitionWizardContext> {
    public async execute(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { location, templateParameterDefinitions, templateParameters, templateResources, workspaceFolderPath } = wizardContext;

        const definitions = await new Promise<string[]>((resolve, reject) => {
            glob(path.join(workspaceFolderPath!, "**/*.definition.json"), (err, matches) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(matches);
                }
            });
        });
        const names = definitions.map((definition) => path.basename(definition).replace(/\.definition\.json$/i, ""));

        for (const name of names) {
            const file = path.join(workspaceFolderPath!, `${name}.definition.json`);
            const json = await fse.readJSON(file);
            const {
                properties: {
                    definition,
                    parameters
                }
            } = json.resources[0];

            const workflow: Workflow = {
                definition,
                location,
                name,
                parameters
            };

            const templateResource = generateTemplateResource(workflow);
            templateResources.push(templateResource);

            const templateParameterDefinition = generateTemplate(workflow).parameters;
            Object.assign(templateParameterDefinitions, templateParameterDefinition);

            const templateParameter = generateParameters(workflow);
            Object.assign(templateParameters, templateParameter);
        }

        return wizardContext;
    }
}
