import LogicAppsManagementClient = require("azure-arm-logic");
import { Workflow, WorkflowVersion } from "azure-arm-logic/lib/models";
import { IAzureNode, IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import * as nodeUtils from "../utils/nodeUtils";
import { LogicAppVersionTreeItem } from "./LogicAppVersionTreeItem";

export class LogicAppVersionsTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azLogicAppsWorkflowVersions";
    public readonly childTypeLabel = localize("azLogicApps.Version", "Version");
    public readonly contextValue = LogicAppVersionsTreeItem.contextValue;
    public readonly label = localize("azLogicApps.Versions", "Versions");

    private nextLink: string | undefined;

    constructor(private readonly client: LogicAppsManagementClient, private readonly workflow: Workflow) {
    }

    public hasMoreChildren(): boolean {
        return false;
    }

    public get iconPath(): nodeUtils.IThemedIconPath {
        return nodeUtils.getThemedIconPath("BulletList");
    }

    public get id(): string {
        return `${this.workflow.id!}/versions`;
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

        const workflowVersions = this.nextLink === undefined
            ? await this.client.workflowVersions.list(this.resourceGroupName, this.workflowName)
            : await this.client.workflowVersions.listNext(this.nextLink);

        this.nextLink = workflowVersions.nextLink;

        return workflowVersions.map((workflowVersion: WorkflowVersion) => new LogicAppVersionTreeItem(workflowVersion));
    }
}
