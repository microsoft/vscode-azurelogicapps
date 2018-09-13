/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccount } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, IAzureNode, IAzureTreeItem, IChildProvider } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { runNewIntegrationAccountWizard } from "../../wizard/integration-account/createIntegrationAccountWizard";
import { IntegrationAccountTreeItem } from "./IntegrationAccountTreeItem";

export class IntegrationAccountProvider implements IChildProvider {
    public readonly childTypeLabel = localize("azIntegrationAccounts.IntegrationAccount", "Integration Account");

    private nextLink: string | undefined;

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public async loadMoreChildren(node: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const client = new LogicAppsManagementClient(node.credentials, node.subscriptionId);
        addExtensionUserAgent(client);

        const integrationAccounts = this.nextLink === undefined
            ? await client.integrationAccounts.listBySubscription()
            : await client.integrationAccounts.listBySubscriptionNext(this.nextLink);

        this.nextLink = integrationAccounts.nextLink;

        return integrationAccounts.map((integrationAccount: IntegrationAccount) => new IntegrationAccountTreeItem(client, integrationAccount));
    }

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
        return runNewIntegrationAccountWizard(node, showCreatingNode);
    }
}
