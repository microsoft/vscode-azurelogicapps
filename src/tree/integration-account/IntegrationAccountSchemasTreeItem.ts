/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountSchema } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";
import { runNewSchemaWizard } from "../../wizard/integration-account/schemas/createSchemaWizard";
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

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
        return runNewSchemaWizard(this.integrationAccount, node, showCreatingNode);
    }
}
