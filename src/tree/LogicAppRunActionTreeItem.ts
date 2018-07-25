/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkflowRunAction } from "azure-arm-logic/lib/models";
import { IAzureTreeItem } from "vscode-azureextensionui";
import * as nodeUtils from "../utils/nodeUtils";

enum LogicAppRunStatus {
    Aborted = "Aborted",
    Cancelled = "Cancelled",
    Failed = "Failed",
    Running = "Running",
    Skipped = "Skipped",
    Succeeded = "Succeeded"
}

export class LogicAppRunActionTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azLogicAppsWorkflowRunAction";
    public readonly contextValue = LogicAppRunActionTreeItem.contextValue;

    public constructor(private readonly workflowRunAction: WorkflowRunAction) {
    }

    public get commandId(): string {
        return "azureLogicApps.openRunActionInEditor";
    }

    public get iconPath(): string {
        const status = this.workflowRunAction.status!;

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

    public get id(): string {
        return this.workflowRunAction.id!;
    }

    public get label(): string {
        return this.workflowRunAction.name!;
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflowRunAction, null, 4);
    }
}
