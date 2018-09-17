/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";
import { runNewPartnerWizard } from "../../wizard/integration-account/partners/createPartnerWizard";
import { IntegrationAccountPartnerTreeItem } from "./IntegrationAccountPartnerTreeItem";

export class IntegrationAccountPartnersTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccountPartners";
    public readonly childTypeLabel = localize("azIntegrationAccounts.Partner", "Partner");
    public readonly contextValue = IntegrationAccountPartnersTreeItem.contextValue;
    public readonly label = localize("azIntegrationAccounts.Partners", "Partners");
    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly integrationAccount: IntegrationAccount) {
    }

    public get iconPath(): IThemedIconPath {
        return getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.integrationAccount.id!}/partners`;
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

        const integrationAccountPartners = this.nextLink === undefined
            ? await this.client.integrationAccountPartners.list(this.resourceGroupName, this.integrationAccountName)
            : await this.client.integrationAccountPartners.listNext(this.nextLink);

        this.nextLink = integrationAccountPartners.nextLink;

        return integrationAccountPartners.map((partner: IntegrationAccountPartner) => new IntegrationAccountPartnerTreeItem(this.client, partner));
    }

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
        return runNewPartnerWizard(this.integrationAccount, node, showCreatingNode);
    }
}
