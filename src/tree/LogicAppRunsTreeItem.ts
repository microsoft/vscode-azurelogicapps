/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow, WorkflowRun } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import * as nodeUtils from "../utils/nodeUtils";
import { LogicAppRunTreeItem } from "./LogicAppRunTreeItem";

export class LogicAppRunsTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azLogicAppsWorkflowRuns";
    public readonly childTypeLabel = localize("azLogicApps.Run", "Run");
    public readonly contextValue = LogicAppRunsTreeItem.contextValue;
    public readonly label = localize("azLogicApps.Runs", "Runs");

    private nextLink: string | undefined;

    constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow) {
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public get iconPath(): nodeUtils.IThemedIconPath {
        return nodeUtils.getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.workflow.id!}/runs`;
    }

    public get resourceGroupName(): string {
        return this.workflow.id!.split("/").slice(-5, -4)[0];
    }

    public get workflowName(): string {
        return this.workflow.name!;
    }

    public async loadMoreChildren(_: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const workflowRuns = this.nextLink === undefined
            ? await this.client.workflowRuns.list(this.resourceGroupName, this.workflowName)
            : await this.client.workflowRuns.listNext(this.nextLink);

        this.nextLink = workflowRuns.nextLink;

        return workflowRuns.map((workflowRun: WorkflowRun) => new LogicAppRunTreeItem(this.client, workflowRun));
    }
}
