/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow, WorkflowRun, WorkflowRunAction } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import * as nodeUtils from "../utils/nodeUtils";
import { LogicAppRunActionTreeItem } from "./LogicAppRunActionTreeItem";

export class LogicAppRunActionsTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azLogicAppsWorkflowRunActions";
    public readonly childTypeLabel = localize("azLogicApps.RunAction", "Action");
    public readonly contextValue = LogicAppRunActionsTreeItem.contextValue;
    public readonly label = localize("azLogicApps.RunActions", "Actions");

    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow, private readonly workflowRun: WorkflowRun) {
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public get iconPath(): nodeUtils.IThemedIconPath {
        return nodeUtils.getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.workflowRun.id!}/actions`;
    }

    public get resourceGroupName(): string {
        return this.workflow.id!.split("/").slice(-5, -4)[0];
    }

    public get runName(): string {
        return this.workflowRun.name!;
    }

    public get workflowName(): string {
        return this.workflow.name!;
    }

    public async loadMoreChildren(_: IAzureNode, clearCache: boolean): Promise<IAzureTreeItem[]> {
        if (clearCache) {
            this.nextLink = undefined;
        }

        const workflowRunActions = this.nextLink === undefined
            ? await this.client.workflowRunActions.list(this.resourceGroupName, this.workflowName, this.runName)
            : await this.client.workflowRunActions.listNext(this.nextLink);

        this.nextLink = workflowRunActions.nextLink;

        return workflowRunActions.map((workflowRunAction: WorkflowRunAction) => new LogicAppRunActionTreeItem(workflowRunAction));
    }
}
