/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getIconPath } from "../../utils/nodeUtils";
import { IntegrationAccountAgreementsTreeItem } from "./integrationAccountAgreementsTreeItem";
import { IntegrationAccountMapsTreeItem } from "./IntegrationAccountMapsTreeItem";
import { IntegrationAccountPartnersTreeItem } from "./IntegrationAccountPartnersTreeItem";
import { IntegrationAccountSchemasTreeItem } from "./IntegrationAccountSchemasTreeItem";

export class IntegrationAccountTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccount";
    public readonly childTypeLabel: string = localize("azIntegrationAccounts.child", "Child");
    public contextValue = IntegrationAccountTreeItem.contextValue;
    public integrationAccountAgreementsItem: IntegrationAccountAgreementsTreeItem;
    public integrationAccountMapsItem: IntegrationAccountMapsTreeItem;
    public integrationAccountPartnersItem: IntegrationAccountPartnersTreeItem;
    public integrationAccountSchemasItem: IntegrationAccountSchemasTreeItem;

    public constructor(private readonly client: LogicAppsManagementClient, private integrationAccount: IntegrationAccount) {
        this.integrationAccountAgreementsItem = new IntegrationAccountAgreementsTreeItem(client, integrationAccount);
        this.integrationAccountMapsItem = new IntegrationAccountMapsTreeItem(client, integrationAccount);
        this.integrationAccountPartnersItem = new IntegrationAccountPartnersTreeItem(client, integrationAccount);
        this.integrationAccountSchemasItem = new IntegrationAccountSchemasTreeItem(client, integrationAccount);
    }

    public get iconPath(): string {
        return getIconPath(IntegrationAccountTreeItem.contextValue);
    }

    public get id(): string {
        return this.integrationAccount.id!;
    }

    public get label(): string {
        return this.integrationAccount.name!;
    }

    public get resourceGroupName(): string {
        return this.integrationAccount.id!.split("/").slice(-5, -4)[0];
    }

    public get integrationAccountName(): string {
        return this.integrationAccount.name!;
    }

    public hasMoreChildren(): boolean {
        return false;
    }

    public async getProperties(refresh = false): Promise<string> {
        if (refresh) {
            this.integrationAccount = await this.client.integrationAccounts.get(this.resourceGroupName, this.integrationAccountName);
        }

        return JSON.stringify(this.integrationAccount, null, 4);
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.integrationAccounts.deleteMethod(this.resourceGroupName, this.integrationAccountName);
    }

    public async loadMoreChildren(): Promise<IAzureTreeItem[]> {
        return [
            this.integrationAccountAgreementsItem,
            this.integrationAccountMapsItem,
            this.integrationAccountPartnersItem,
            this.integrationAccountSchemasItem
        ];
    }

    public pickTreeItem(expectedContextValue: string): IAzureTreeItem | undefined {
        switch (expectedContextValue) {
            case IntegrationAccountAgreementsTreeItem.contextValue:
                return this.integrationAccountAgreementsItem;
            case IntegrationAccountMapsTreeItem.contextValue:
                return this.integrationAccountMapsItem;
            case IntegrationAccountPartnersTreeItem.contextValue:
                return this.integrationAccountPartnersItem;
            case IntegrationAccountSchemasTreeItem.contextValue:
                return this.integrationAccountSchemasItem;
            default:
                return undefined;
        }
    }
}
