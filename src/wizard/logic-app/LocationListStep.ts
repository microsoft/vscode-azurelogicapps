/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { askForLocation } from "../../utils/locationUtils";
import { IBuildDefinitionWizardContext } from "./createBuildDefinition";

export class LocationListStep extends AzureWizardPromptStep<IBuildDefinitionWizardContext> {
    public async prompt(wizardContext: IBuildDefinitionWizardContext): Promise<IBuildDefinitionWizardContext> {
        const location = await askForLocation();
        if (!location) {
            throw new UserCancelledError();
        }

        return {
            ...wizardContext,
            location
        };
    }
}
