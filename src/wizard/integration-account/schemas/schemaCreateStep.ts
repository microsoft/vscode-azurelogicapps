/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountSchema } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, AzureWizardExecuteStep } from "vscode-azureextensionui";
import { IntegrationAccountSchemaTreeItem } from "../../../tree/integration-account/IntegrationAccountSchemaTreeItem";
import { createNewSchema } from "../../../utils/integration-account/schemaUtils";
import { ISchemaWizardContext } from "./createSchemaWizard";

export class SchemaCreateStep extends AzureWizardExecuteStep<ISchemaWizardContext> {
    public async execute(wizardContext: ISchemaWizardContext): Promise<ISchemaWizardContext> {
        const client = new LogicAppsManagementClient(wizardContext.credentials, wizardContext.subscriptionId, wizardContext.environment.resourceManagerEndpointUrl);
        addExtensionUserAgent(client);

        const newSchema: IntegrationAccountSchema = await client.integrationAccountSchemas.createOrUpdate(wizardContext.resourceGroup!.name!,
            wizardContext.integrationAccountName,
            wizardContext.schemaName!,
            await createNewSchema(wizardContext.schemaName!));

        wizardContext.schema = new IntegrationAccountSchemaTreeItem(client, newSchema);

        return wizardContext;
    }
}
