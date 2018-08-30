/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountMap } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";
import { IntegrationAccountMapTreeItem } from "./IntegrationAccountMapTreeItem";

export class IntegrationAccountMapsTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccountMaps";
    public readonly childTypeLabel = localize("azIntegrationAccounts.Map", "Map");
    public readonly contextValue = IntegrationAccountMapsTreeItem.contextValue;
    public readonly label = localize("azIntegrationAccounts.Maps", "Maps");

    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly integrationAccount: IntegrationAccount) {
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public get iconPath(): IThemedIconPath {
        return getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.integrationAccount.id!}/maps`;
    }

    public get resourceGroupName(): string {
        return this.integrationAccount.id!.split("/").slice(-5, -4)[0];
    }

    public get integrationAccountName(): string {
        return this.integrationAccount.name!;
    }

    public async loadMoreChildren(_: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const integrationAccountMaps = this.nextLink === undefined
            ? await this.client.maps.listByIntegrationAccounts(this.resourceGroupName, this.integrationAccountName)
            : await this.client.maps.listByIntegrationAccountsNext(this.nextLink);

        this.nextLink = integrationAccountMaps.nextLink;

        return integrationAccountMaps.map((workflowTrigger: IntegrationAccountMap) => new IntegrationAccountMapTreeItem(this.client, workflowTrigger));
    }
}
