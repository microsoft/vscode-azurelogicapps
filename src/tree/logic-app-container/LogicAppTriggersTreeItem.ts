/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as request from "request-promise-native";
import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, LogicApp, Results, Trigger } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { getThemedIconPath } from "../../utils/nodeUtils";
import { LogicAppTriggerTreeItem } from "./LogicAppTriggerTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppTriggersTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowTriggers";
    public readonly contextValue: string = LogicAppTriggersTreeItem.contextValue;
    public readonly iconPath = getThemedIconPath("BulletList");

    private children: LogicAppTriggerTreeItem[] | undefined;
    private nextLink: string | undefined;

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly logicApp: LogicApp) {
        super(localize("azLogicAppContainers.triggers", "Triggers"), vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        if (this.children !== undefined) {
            return this.includeLoadMoreConditionally(this.children, this.nextLink);
        }

        const { nextLink, value } = await this.client.getTriggersByLogicApp(this.container.id, this.logicApp.id);
        const children = value.map(mapToLogicAppTriggerTreeItem(this.client, this.container));
        this.children = children;
        this.nextLink = nextLink;
        return this.includeLoadMoreConditionally(children, nextLink);
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public async loadMore(): Promise<void> {
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const { nextLink, value }: Results<Trigger> = await request(this.nextLink!, options);
        const children = value.map(mapToLogicAppTriggerTreeItem(this.client, this.container));
        this.children = [...this.children!, ...children];
        this.nextLink = nextLink;
    }
}

function mapToLogicAppTriggerTreeItem(client: ILogicAppsContainerClient, container: Container) {
    return (trigger: Trigger) => {
        return new LogicAppTriggerTreeItem(client, container, trigger);
    };
}
