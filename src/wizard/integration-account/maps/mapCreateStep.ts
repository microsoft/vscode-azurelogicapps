/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountMap } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, AzureWizardExecuteStep } from "vscode-azureextensionui";
import { IntegrationAccountMapTreeItem } from "../../../tree/integration-account/IntegrationAccountMapTreeItem";
import { createNewMap, MapType } from "../../../utils/integration-account/mapUtils";
import { IMapWizardContext } from "./createMapWizard";

export class MapCreateStep extends AzureWizardExecuteStep<IMapWizardContext> {
    public async execute(wizardContext: IMapWizardContext): Promise<IMapWizardContext> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.environment.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        const newMap: IntegrationAccountMap = await client.integrationAccountMaps.createOrUpdate(wizardContext.resourceGroup!.name!,
            wizardContext.integrationAccountName,
            wizardContext.mapName!,
            await createNewMap(wizardContext.mapName!, MapType[wizardContext.mapType! as MapType]));

        wizardContext.map = new IntegrationAccountMapTreeItem(client, newMap);

        return wizardContext;
    }
}
