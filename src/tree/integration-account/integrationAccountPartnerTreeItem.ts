/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountPartner, PartnerContent } from "azure-arm-logic/lib/models";
import { IAzureTreeItem } from "vscode-azureextensionui";
import { PartnerType } from "../../utils/integration-account/partnerUtils";
import { getIconPath } from "../../utils/nodeUtils";

export class IntegrationAccountPartnerTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azIntegrationAccountPartner";
    public readonly contextValue = IntegrationAccountPartnerTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private integrationAccountPartner: IntegrationAccountPartner) {
    }

    public get commandId(): string {
        return "azIntegrationAccounts.openPartnerInEditor";
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.integrationAccountPartners.deleteMethod(this.resourceGroupName, this.integrationAccountName, this.label);
    }

    public get iconPath(): string {
        return getIconPath(IntegrationAccountPartnerTreeItem.contextValue);
    }

    public get id(): string {
        return this.integrationAccountPartner.id!;
    }

    public get label(): string {
        return this.integrationAccountPartner.name!;
    }

    public get resourceGroupName(): string {
        return this.integrationAccountPartner.id!.split("/").slice(-7, -6)[0];
    }

    public get integrationAccountPartnerName(): string {
        return this.integrationAccountPartner.name!;
    }

    public get integrationAccountName(): string {
        return this.integrationAccountPartner.id!.split("/").slice(-3, -2)[0];
    }

    public get partnerType(): PartnerType {
        return (PartnerType as any)[this.integrationAccountPartner.partnerType];
    }

    public async getContent(): Promise<string> {
        return JSON.stringify(this.integrationAccountPartner.content, null, 4);
    }

    public async getProperties(refresh = false): Promise<string> {
        if (refresh) {
            this.integrationAccountPartner = await this.client.integrationAccountPartners.get(this.resourceGroupName, this.integrationAccountName, this.integrationAccountPartnerName);
        }

        return JSON.stringify(this.integrationAccountPartner, null, 4);
    }

    public async update(partnerContent: PartnerContent): Promise<string> {
        const partner: IntegrationAccountPartner = {
            content: partnerContent,
            partnerType: this.partnerType
        };

        const updatedPartner = await this.client.integrationAccountPartners.createOrUpdate(this.resourceGroupName, this.integrationAccountName, this.integrationAccountPartnerName, partner);
        return JSON.stringify(updatedPartner.content, null, 4);
    }
}
