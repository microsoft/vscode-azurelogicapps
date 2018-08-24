/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { getIconPath } from "../../utils/nodeUtils";
import { IntegrationAccountMapsTreeItem } from "./IntegrationAccountMapsTreeItem";

export class IntegrationAccountTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccount";
    public contextValue = IntegrationAccountTreeItem.contextValue;
    public integrationAccountMapItem: IntegrationAccountMapsTreeItem;

    public constructor(private readonly client: LogicAppsManagementClient, private integrationAccount: IntegrationAccount) {
        this.integrationAccountMapItem = new IntegrationAccountMapsTreeItem(client, integrationAccount);
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

    public async getDefinition(refresh = false): Promise<string> {
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
            this.integrationAccountMapItem
        ];
    }

    public pickTreeItem(expectedContextValue: string): IAzureTreeItem | undefined {
        switch (expectedContextValue) {
            case IntegrationAccountMapsTreeItem.contextValue:
                return this.integrationAccountMapItem;

            default:
                return undefined;
        }
    }
}
