/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount, IntegrationAccountAgreement } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";
import { runNewAgreementWizard } from "../../wizard/integration-account/agreements/createAgreementWizard";
import { IntegrationAccountAgreementTreeItem } from "./IntegrationAccountAgreementTreeItem";

export class IntegrationAccountAgreementsTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azIntegrationAccountAgreements";
    public readonly childTypeLabel = localize("azIntegrationAccounts.Agreement", "Agreement");
    public readonly contextValue = IntegrationAccountAgreementsTreeItem.contextValue;
    public readonly label = localize("azIntegrationAccounts.Agreements", "Agreements");
    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly integrationAccount: IntegrationAccount) {
    }

    public get iconPath(): IThemedIconPath {
        return getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.integrationAccount.id!}/agreements`;
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

        const integrationAccountAgreements = this.nextLink === undefined
            ? await this.client.integrationAccountAgreements.list(this.resourceGroupName, this.integrationAccountName)
            : await this.client.integrationAccountAgreements.listNext(this.nextLink);

        this.nextLink = integrationAccountAgreements.nextLink;

        return integrationAccountAgreements.map((map: IntegrationAccountAgreement) => new IntegrationAccountAgreementTreeItem(this.client, map));
    }

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
        return runNewAgreementWizard(this.integrationAccount, node, showCreatingNode);
    }
}
