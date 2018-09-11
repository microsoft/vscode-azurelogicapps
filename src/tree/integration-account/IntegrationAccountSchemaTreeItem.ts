/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountSchema } from "azure-arm-logic/lib/models";
import * as request from "request-promise-native";
import { IAzureTreeItem } from "vscode-azureextensionui";
import { SchemaType } from "../../utils/integration-account/schemaUtils";
import { getIconPath } from "../../utils/nodeUtils";

export class IntegrationAccountSchemaTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azIntegrationAccountSchema";
    public readonly contextValue = IntegrationAccountSchemaTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private integrationAccountSchema: IntegrationAccountSchema) {
    }

    public get commandId(): string {
        return "azIntegrationAccounts.openSchemaInEditor";
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.schemas.deleteMethod(this.resourceGroupName, this.integrationAccountName, this.label);
    }

    public get iconPath(): string {
        return getIconPath(IntegrationAccountSchemaTreeItem.contextValue);
    }

    public get id(): string {
        return this.integrationAccountSchema.id!;
    }

    public get label(): string {
        return this.integrationAccountSchema.name!;
    }

    public get resourceGroupName(): string {
        return this.integrationAccountSchema.id!.split("/").slice(-7, -6)[0];
    }

    public get integrationAccountSchemaName(): string {
        return this.integrationAccountSchema.name!;
    }

    public get integrationAccountName(): string {
        return this.integrationAccountSchema.id!.split("/").slice(-3, -2)[0];
    }

    public get schemaType(): SchemaType {
        return (SchemaType as any)[this.integrationAccountSchema.schemaType];
    }

    public async getContent(): Promise<string> {
        return request(this.integrationAccountSchema.contentLink!.uri!);
    }

    public async getProperties(refresh = false): Promise<string> {
        if (refresh) {
            this.integrationAccountSchema = await this.client.schemas.get(this.resourceGroupName, this.integrationAccountName, this.integrationAccountSchemaName);
        }

        return JSON.stringify(this.integrationAccountSchema, null, 4);
    }

    public async update(schemaContent: string): Promise<string> {
        const schema: IntegrationAccountSchema = {
            content: schemaContent,
            // contentType: getContentType(this.schemaType),
            schemaType: this.schemaType
        };

        const updatedSchema = await this.client.schemas.createOrUpdate(this.resourceGroupName, this.integrationAccountName, this.integrationAccountSchemaName, schema);
        return request(updatedSchema.contentLink!.uri!);
    }
}
