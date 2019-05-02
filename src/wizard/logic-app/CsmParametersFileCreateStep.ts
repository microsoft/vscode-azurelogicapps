/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from "fs-extra";
import { AzureWizardExecuteStep } from "vscode-azureextensionui";
import { generateDeploymentTemplateParameters } from "../../utils/logic-app/templateUtils";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class CsmParametersFileCreateStep extends AzureWizardExecuteStep<IBuildDefinitionWizardContext> {
    public async execute(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { csmParametersFilename, templateParameters } = wizardContext;
        const deploymentTemplateParameters = generateDeploymentTemplateParameters(templateParameters);

        await fse.writeJSON(csmParametersFilename!, deploymentTemplateParameters, { spaces: 4 });

        return wizardContext;
    }
}
