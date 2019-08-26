/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { WorkflowTrigger } from "azure-arm-logic/lib/models";
import { IAzureTreeItem } from "vscode-azureextensionui";
import { getThemedIconPath, IThemedIconPath } from "../../utils/nodeUtils";

export class LogicAppTriggerTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azLogicAppsWorkflowTrigger";
    public readonly contextValue = LogicAppTriggerTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflowTrigger: WorkflowTrigger) {
    }

    public get commandId(): string {
        return "azureLogicApps.openTriggerInEditor";
    }

    public get iconPath(): IThemedIconPath {
        return getThemedIconPath("Trigger");
    }

    public get id(): string {
        return this.workflowTrigger.id!;
    }

    public get label(): string {
        return this.workflowTrigger.name!;
    }

    public get resourceGroupName(): string {
        return this.workflowTrigger.id!.split("/").slice(-7, -6)[0];
    }

    public get triggerName(): string {
        return this.workflowTrigger.name!;
    }

    public get workflowName(): string {
        return this.workflowTrigger.id!.split("/").slice(-3, -2)[0];
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflowTrigger, null, 4);
    }

    public async run(): Promise<void> {
        await this.client.workflowTriggers.run(this.resourceGroupName, this.workflowName, this.triggerName);
    }
}
