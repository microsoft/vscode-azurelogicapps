/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from "fs-extra";
import { AzureWizardExecuteStep } from "vscode-azureextensionui";
import { generateDeploymentTemplate } from "../../utils/logic-app/templateUtils";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class CsmFileCreateStep extends AzureWizardExecuteStep<IBuildDefinitionWizardContext> {
    public async execute(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { csmFilename, templateParameterDefinitions, templateResources } = wizardContext;
        const deploymentTemplate = generateDeploymentTemplate(templateParameterDefinitions!, templateResources!);

        await fse.writeJSON(csmFilename!, deploymentTemplate, { spaces: 4 });

        return wizardContext;
    }
}
