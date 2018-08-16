/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow, WorkflowVersion } from "azure-arm-logic/lib/models";
import { IAzureTreeItem } from "vscode-azureextensionui";
import * as nodeUtils from "../utils/nodeUtils";

export class LogicAppVersionTreeItem implements IAzureTreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowVersion";
    public readonly contextValue: string = LogicAppVersionTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow, private readonly workflowVersion: WorkflowVersion) {
    }

    public get commandId(): string {
        return "azureLogicApps.openVersionInEditor";
    }

    public get iconPath(): string {
        return nodeUtils.getIconPath(LogicAppVersionTreeItem.contextValue);
    }

    public get id(): string {
        return this.workflowVersion.id!;
    }

    public get label(): string {
        return this.workflowVersion.name!;
    }

    public get resourceGroupName(): string {
        return this.workflow.id!.split("/").slice(-5, -4)[0];
    }

    public get workflowName(): string {
        return this.workflow.name!;
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflowVersion.definition, null, 4);
    }

    public async promote(): Promise<void> {
        const workflow: Workflow = {
            ...this.workflowVersion,
            state: this.workflow.state!
        };

        await this.client.workflows.createOrUpdate(this.resourceGroupName, this.workflowName, workflow);
    }
}
