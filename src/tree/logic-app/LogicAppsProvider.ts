/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent, IAzureNode, IAzureTreeItem, IChildProvider } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { createLogicApp } from "../../wizard/logic-app/createLogicApp";
import { LogicAppTreeItem } from "./LogicAppTreeItem";

export class LogicAppsProvider implements IChildProvider {
    public readonly childTypeLabel = localize("azLogicApps.LogicApp", "Logic App");

    private nextLink: string | undefined;

    public async createChild(node: IAzureNode, showCreatingNode: (label: string) => void): Promise<IAzureTreeItem> {
        return createLogicApp(node, showCreatingNode);
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public async loadMoreChildren(node: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const client = new LogicAppsManagementClient(node.credentials, node.subscriptionId);
        addExtensionUserAgent(client);

        const logicApps = this.nextLink === undefined
            ? await client.workflows.listBySubscription()
            : await client.workflows.listBySubscriptionNext(this.nextLink);

        this.nextLink = logicApps.nextLink;

        return logicApps.map((logicApp: Workflow) => new LogicAppTreeItem(client, logicApp));
    }
}
