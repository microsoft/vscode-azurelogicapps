/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as request from "request-promise-native";
import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, Results, Run, RunAction } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { getThemedIconPath } from "../../utils/nodeUtils";
import { LogicAppRunActionTreeItem } from "./LogicAppRunActionTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppRunActionsTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowRunActions";
    public readonly contextValue: string = LogicAppRunActionsTreeItem.contextValue;
    public readonly iconPath = getThemedIconPath("BulletList");

    private children: LogicAppRunActionTreeItem[] | undefined;
    private nextLink: string | undefined;

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly run: Run) {
        super(localize("azLogicAppContainers.actions", "Actions"), vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        if (this.children !== undefined) {
            return this.includeLoadMoreConditionally(this.children, this.nextLink);
        }

        const { nextLink, value } = await this.client.getRunActionsByRun(this.container.id, this.run.id);
        const children = value.map(mapToLogicAppRunActionTreeItem);
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
        const { nextLink, value }: Results<RunAction> = await request(this.nextLink!, options);
        const children = value.map(mapToLogicAppRunActionTreeItem);
        this.children = [...this.children!, ...children];
        this.nextLink = nextLink;
    }
}

function mapToLogicAppRunActionTreeItem(runAction: RunAction): LogicAppRunActionTreeItem {
    return new LogicAppRunActionTreeItem(runAction);
}
