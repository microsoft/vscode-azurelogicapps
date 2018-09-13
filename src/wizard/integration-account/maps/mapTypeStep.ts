/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureWizardPromptStep, UserCancelledError } from "vscode-azureextensionui";
import { MapType } from "../../../utils/integration-account/mapUtils";
import { IMapWizardContext } from "./createMapWizard";

export class MapTypeStep extends AzureWizardPromptStep<IMapWizardContext> {
    public async prompt(wizardContext: IMapWizardContext): Promise<IMapWizardContext> {
        const mapTypes = Object.keys(MapType);
        wizardContext.mapType = await vscode.window.showQuickPick(mapTypes);

        if (wizardContext.mapType) {
            return wizardContext;
        }

        throw new UserCancelledError();
    }
}
