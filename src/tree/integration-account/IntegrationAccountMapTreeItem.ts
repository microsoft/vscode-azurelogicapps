/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountMap } from "azure-arm-logic/lib/models";
import * as request from "request-promise";
import { IAzureTreeItem } from "vscode-azureextensionui";
import { getIconPath } from "../../utils/nodeUtils";

export enum MapType {
    Liquid = "Liquid",
    Xslt = "Xslt",
    Xslt20 = "Xslt20",
    Xslt30 = "Xslt30"
}

export class IntegrationAccountMapTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azIntegrationAccountMap";
    public readonly contextValue = IntegrationAccountMapTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private integrationAccountMap: IntegrationAccountMap) {
    }

    public get commandId(): string {
        return "azIntegrationAccounts.openMapInEditor";
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.maps.deleteMethod(this.resourceGroupName, this.integrationAccountName, this.label);
    }

    public get iconPath(): string {
        return getIconPath(IntegrationAccountMapTreeItem.contextValue);
    }

    public get id(): string {
        return this.integrationAccountMap.id!;
    }

    public get label(): string {
        return this.integrationAccountMap.name!;
    }

    public get resourceGroupName(): string {
        return this.integrationAccountMap.id!.split("/").slice(-7, -6)[0];
    }

    public get integrationAccountMapName(): string {
        return this.integrationAccountMap.name!;
    }

    public get integrationAccountName(): string {
        return this.integrationAccountMap.id!.split("/").slice(-3, -2)[0];
    }

    public get mapType(): MapType {
        return (MapType as any)[this.integrationAccountMap.mapType];
    }

    public async getContent(): Promise<string> {
        return request(this.integrationAccountMap.contentLink!.uri!);
    }

    public async getDefinition(refresh = false): Promise<string> {
        if (refresh) {
            this.integrationAccountMap = await this.client.maps.get(this.resourceGroupName, this.integrationAccountName, this.integrationAccountMapName);
        }

        return JSON.stringify(this.integrationAccountMap, null, 4);
    }

    public async update(mapContent: string): Promise<string> {
        const map: IntegrationAccountMap = {
            content: mapContent,
            contentType: this.mapType === MapType.Liquid ? "text/plain" : "application/xml",
            mapType: this.mapType
        };

        const updatedMap = await this.client.maps.createOrUpdate(this.resourceGroupName, this.integrationAccountName, this.integrationAccountMapName, map);
        return request(updatedMap.contentLink!.uri!);
    }
}
