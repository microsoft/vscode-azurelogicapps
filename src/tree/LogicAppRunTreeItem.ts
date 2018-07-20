import LogicAppsManagementClient = require("azure-arm-logic");
import { WorkflowRun } from "azure-arm-logic/lib/models";
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

export class LogicAppRunTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azLogicAppsWorkflowRun";
    public readonly contextValue = LogicAppRunTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private readonly workflowRun: WorkflowRun) {
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
        return this.workflowRun.id!.split("/").slice(-7, -6)[0];
    }

    public get triggerName(): string {
        return this.workflowRun.trigger!.name!;
    }

    public get workflowName(): string {
        return this.workflowRun.id!.split("/").slice(-3, -2)[0];
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflowRun, null, 4);
    }

    public async resubmit(): Promise<void> {
        await this.client.workflowTriggerHistories.resubmit(this.resourceGroupName, this.workflowName, this.triggerName, this.historyName);
    }
}
