/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as request from "request-promise-native";
import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, LogicApp, Results, Version } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { getThemedIconPath } from "../../utils/nodeUtils";
import { LogicAppCurrentVersionTreeItem } from "./LogicAppCurrentVersionTreeItem";
import { LogicAppVersionTreeItem } from "./LogicAppVersionTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppVersionsTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowVersions";
    public readonly contextValue: string = LogicAppVersionsTreeItem.contextValue;
    public readonly iconPath = getThemedIconPath("BulletList");

    private children: LogicAppVersionTreeItem[] | undefined;
    private nextLink: string | undefined;

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly logicApp: LogicApp) {
        super(localize("azLogicAppContainers.versions", "Versions"), vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        if (this.children !== undefined) {
            return this.includeLoadMoreConditionally(this.children, this.nextLink);
        }

        const { nextLink, value } = await this.client.getVersionsByLogicApp(this.container.id, this.logicApp.id);
        const children = value.map(mapToLogicAppVersionTreeItem(this.client, this.container, this.logicApp));
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
        const { nextLink, value }: Results<Version> = await request(this.nextLink!, options);
        const children = value.map(mapToLogicAppVersionTreeItem(this.client, this.container, this.logicApp));
        this.children = [...this.children!, ...children];
        this.nextLink = nextLink;
    }
}

function mapToLogicAppVersionTreeItem(client: ILogicAppsContainerClient, container: Container, logicApp: LogicApp) {
    return (version: Version) => {
        if (logicApp.properties.version === version.name) {
            return new LogicAppCurrentVersionTreeItem(client, container, logicApp, version);
        } else {
            return new LogicAppVersionTreeItem(client, container, logicApp, version);
        }
    };
}
