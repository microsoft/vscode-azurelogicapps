/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountSchema, IntegrationAccountSchemaListResult } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { createNewSchema } from "../../utils/integration-account/schemaUtils";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";
import { IntegrationAccountSchemaTreeItem } from "./IntegrationAccountSchemaTreeItem";

export class IntegrationAccountSchemasTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccountSchemas";
    public readonly childTypeLabel = localize("azIntegrationAccounts.Schema", "Schema");
    public readonly contextValue = IntegrationAccountSchemasTreeItem.contextValue;
    public readonly label = localize("azIntegrationAccounts.Schemas", "Schemas");
    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly integrationAccount: IntegrationAccount) {
    }

    public get iconPath(): IThemedIconPath {
        return getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.integrationAccount.id!}/schemas`;
    }

    public get resourceGroupName(): string {
        return this.integrationAccount.id!.split("/").slice(-5, -4)[0];
    }

    public get integrationAccountName(): string {
        return this.integrationAccount.name!;
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public async loadMoreChildren(_: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const integrationAccountSchemas = this.nextLink === undefined
            ? await this.client.schemas.listByIntegrationAccounts(this.resourceGroupName, this.integrationAccountName)
            : await this.client.schemas.listByIntegrationAccountsNext(this.nextLink);

        this.nextLink = integrationAccountSchemas.nextLink;

        return integrationAccountSchemas.map((schema: IntegrationAccountSchema) => new IntegrationAccountSchemaTreeItem(this.client, schema));
    }

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void, userOptions?: any): Promise<IAzureTreeItem> {
        const schemaName = await vscode.window.showInputBox(
        {
            prompt: "Enter the name of your new Schema",
            validateInput: async (value: string): Promise<string | null> => {
                const existingSchemas = await this.getAllSchemas();
                if (existingSchemas && existingSchemas.find((schema) => schema.name === value)) {
                    return localize("azIntegrationAccounts.nameAlreadyInUse", "Name already in use");
                }

                return null;
            }
        });

        if (schemaName) {
            showCreatingNode(schemaName);
            const newSchema: IntegrationAccountSchema = await this.client.schemas.createOrUpdate(this.resourceGroupName,
                                                                this.integrationAccountName,
                                                                schemaName,
                                                                await createNewSchema(schemaName));

            return new IntegrationAccountSchemaTreeItem(this.client, newSchema);
        }
        throw new UserCancelledError();
    }

    private async getAllSchemas(): Promise<IntegrationAccountSchemaListResult> {
        let nextLink: string | undefined;
        const results = await this.client.schemas.listByIntegrationAccounts(this.resourceGroupName, this.integrationAccountName);
        nextLink = results.nextLink;

        while (nextLink) {
            const nextPage = await this.client.schemas.listByIntegrationAccountsNext(nextLink);
            nextLink = nextPage.nextLink;
            results.push(...nextPage);
        }

        return results;
    }
}
