/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountMap, IntegrationAccountMapListResult } from "azure-arm-logic/lib/models";
import * as vscode from "vscode";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem, UserCancelledError } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { createNewMap, MapType } from "../../utils/integration-account/mapUtils";
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
            ? await this.client.maps.listByIntegrationAccounts(this.resourceGroupName, this.integrationAccountName)
            : await this.client.maps.listByIntegrationAccountsNext(this.nextLink);

        this.nextLink = integrationAccountMaps.nextLink;

        return integrationAccountMaps.map((map: IntegrationAccountMap) => new IntegrationAccountMapTreeItem(this.client, map));
    }

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void, userOptions?: any): Promise<IAzureTreeItem> {
        const mapName = await vscode.window.showInputBox(
            {
                prompt: "Enter the name of your new Map",
                validateInput: async (value: string): Promise<string | null> => {
                    const existingMaps = await this.getAllMaps();
                    if (existingMaps && existingMaps.find((map) => map.name === value)) {
                        return "Name already in use";
                    }

                    return null;
                }
            });
        if (mapName) {
            const mapTypes = Object.keys(MapType).map((k) => MapType[k as any]);
            const mapType = await vscode.window.showQuickPick(
                mapTypes);

            if (mapType) {
                showCreatingNode(mapName);
                const newMap: IntegrationAccountMap = await this.client.maps.createOrUpdate(this.resourceGroupName,
                                                                    this.integrationAccountName,
                                                                    mapName,
                                                                    await createNewMap(mapName, (MapType as any)[mapType]));
                return new IntegrationAccountMapTreeItem(this.client, newMap);
            }
        }
        throw new UserCancelledError();
    }

    private async getAllMaps(): Promise<IntegrationAccountMapListResult> {
        let nextLink: string | undefined;
        const results = await this.client.maps.listByIntegrationAccounts(this.resourceGroupName, this.integrationAccountName);
        nextLink = results.nextLink;

        while (nextLink) {
            const nextPage = await this.client.maps.listByIntegrationAccountsNext(nextLink);
            nextLink = nextPage.nextLink;
            results.concat(nextPage);
        }

        return results;
    }
}
