/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from "fs-extra";
import * as path from "path";
import { AzureWizardExecuteStep } from "vscode-azureextensionui";
import { generateBuildDefinition } from "../../utils/logic-app/templateUtils";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class BuildDefinitionCreateStep extends AzureWizardExecuteStep<IBuildDefinitionWizardContext> {
    public async execute(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const { azureSubscription, buildDefinitionFilename, csmFilename, csmParametersFilename, location, resourceGroupName, workspaceFolderPath } = wizardContext;

        const buildDefinition = generateBuildDefinition({
            azureSubscription: azureSubscription!,
            csmFile: path.relative(workspaceFolderPath!, csmFilename!),
            csmParametersFile: path.relative(workspaceFolderPath!, csmParametersFilename!),
            location: location!,
            resourceGroupName: resourceGroupName!
        });

        await fse.writeFile(buildDefinitionFilename!, buildDefinition);

        return wizardContext;
    }
}
