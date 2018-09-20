/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountMap } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";
import { runNewMapWizard } from "../../wizard/integration-account/maps/createMapWizard";
import { IntegrationAccountMapTreeItem } from "./IntegrationAccountMapTreeItem";

export class IntegrationAccountMapsTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccountMaps";
    public readonly childTypeLabel = localize("azIntegrationAccounts.Map", "Map");
    public readonly contextValue = IntegrationAccountMapsTreeItem.contextValue;
    public readonly label = localize("azIntegrationAccounts.Maps", "Maps");
    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly integrationAccount: IntegrationAccount) {
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

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public async loadMoreChildren(_: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const integrationAccountMaps = this.nextLink === undefined
            ? await this.client.integrationAccountMaps.list(this.resourceGroupName, this.integrationAccountName)
            : await this.client.integrationAccountMaps.listNext(this.nextLink);

        this.nextLink = integrationAccountMaps.nextLink;

        return integrationAccountMaps.map((map: IntegrationAccountMap) => new IntegrationAccountMapTreeItem(this.client, map));
    }

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
        return runNewMapWizard(this.integrationAccount, node, showCreatingNode);
    }
}
