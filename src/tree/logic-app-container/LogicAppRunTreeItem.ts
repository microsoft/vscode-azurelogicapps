/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, LogicApp, Run } from "../../clients/LogicAppsContainerClient";
import { getStatusIconPath } from "../../utils/nodeUtils";
import { LogicAppRunActionsTreeItem } from "./LogicAppRunActionsTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppRunTreeItem extends TreeItemBase {
    public static readonly contextValue: string = "azLogicAppsWorkflowRun";
    public readonly contextValue: string = LogicAppRunTreeItem.contextValue;

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly logicApp: LogicApp, private readonly run: Run) {
        super(run.name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public get containerBaseUrl(): string {
        return this.container.properties.baseUrl;
    }

    public get iconPath(): string {
        return getStatusIconPath(this.run.properties.status);
    }

    public get runId(): string {
        return this.run.id;
    }

    public get workflowId(): string {
        return this.logicApp.id;
    }

    public async delete(): Promise<void> {
        await this.client.deleteRun(this.container.id, this.run.id);
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        return [
            new LogicAppRunActionsTreeItem(this.client, this.container, this.run)
        ];
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.run, null, 4);
    }

    public async resubmit(): Promise<void> {
        await this.client.resubmitRun(this.container.id, this.logicApp.id, this.run.id);
    }
}
