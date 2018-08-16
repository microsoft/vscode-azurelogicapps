/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow, WorkflowRun } from "azure-arm-logic/lib/models";
import { IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import * as nodeUtils from "../utils/nodeUtils";
import { LogicAppRunActionsTreeItem } from "./LogicAppRunActionsTreeItem";

enum LogicAppRunStatus {
    Aborted = "Aborted",
    Cancelled = "Cancelled",
    Failed = "Failed",
    Running = "Running",
    Skipped = "Skipped",
    Succeeded = "Succeeded"
}

export class LogicAppRunTreeItem implements IAzureParentTreeItem {
    public static readonly contextValue = "azLogicAppsWorkflowRun";
    public readonly contextValue = LogicAppRunTreeItem.contextValue;
    private readonly logicAppRunActionsTreeItem: LogicAppRunActionsTreeItem;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow, private readonly workflowRun: WorkflowRun) {
        this.logicAppRunActionsTreeItem = new LogicAppRunActionsTreeItem(client, workflow, workflowRun);
    }

    public get commandId(): string {
        return "azureLogicApps.openRunInEditor";
    }

    public get iconPath(): string {
        const status = this.workflowRun.status!;

        switch (status) {
            case LogicAppRunStatus.Aborted:
            case LogicAppRunStatus.Cancelled:
            case LogicAppRunStatus.Failed:
            case LogicAppRunStatus.Running:
            case LogicAppRunStatus.Skipped:
            case LogicAppRunStatus.Succeeded:
                return nodeUtils.getStatusIconPath(status);

            default:
                return nodeUtils.getStatusIconPath("Unknown");
        }
    }

    public get historyName(): string {
        return this.workflowRun.name!;
    }

    public get id(): string {
        return this.workflowRun.id!;
    }

    public get label(): string {
        return this.workflowRun.name!;
    }

    public get resourceGroupName(): string {
        return this.workflow.id!.split("/").slice(-5, -4)[0];
    }

    public get triggerName(): string {
        return this.workflowRun.trigger!.name!;
    }

    public get workflowName(): string {
        return this.workflow.name!;
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflowRun, null, 4);
    }

    public hasMoreChildren(): boolean {
        return false;
    }

    public async loadMoreChildren(): Promise<IAzureTreeItem[]> {
        return [
            this.logicAppRunActionsTreeItem
        ];
    }

    public pickTreeItem(expectedContextValue: string): IAzureTreeItem | undefined {
        switch (expectedContextValue) {
            case LogicAppRunActionsTreeItem.contextValue:
                return this.logicAppRunActionsTreeItem;

            default:
                return undefined;
        }
    }

    public async resubmit(): Promise<void> {
        await this.client.workflowTriggerHistories.resubmit(this.resourceGroupName, this.workflowName, this.triggerName, this.historyName);
    }
}
