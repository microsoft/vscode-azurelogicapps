/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow, WorkflowTrigger } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import { getThemedIconPath, IThemedIconPath } from "../utils/nodeUtils";
import { LogicAppTriggerTreeItem } from "./LogicAppTriggerTreeItem";

export class LogicAppTriggersTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azLogicAppsWorkflowTriggers";
    public readonly childTypeLabel = localize("azLogicApps.Trigger", "Trigger");
    public readonly contextValue = LogicAppTriggersTreeItem.contextValue;
    public readonly label = localize("azLogicApps.Triggers", "Triggers");

    private nextLink: string | undefined;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow) {
    }

    public hasMoreChildren(): boolean {
        return this.nextLink !== undefined;
    }

    public get iconPath(): IThemedIconPath {
        return getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.workflow.id!}/triggers`;
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

        const workflowTriggers = this.nextLink === undefined
            ? await this.client.workflowTriggers.list(this.resourceGroupName, this.workflowName)
            : await this.client.workflowTriggers.listNext(this.nextLink);

        this.nextLink = workflowTriggers.nextLink;

        return workflowTriggers.map((workflowTrigger: WorkflowTrigger) => new LogicAppTriggerTreeItem(this.client, workflowTrigger));
    }
}
