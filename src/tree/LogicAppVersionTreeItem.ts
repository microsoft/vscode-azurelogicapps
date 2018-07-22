/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkflowVersion } from "azure-arm-logic/lib/models";
import { IAzureTreeItem } from "vscode-azureextensionui";
import * as nodeUtils from "../utils/nodeUtils";

export class LogicAppVersionTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azLogicAppsWorkflowVersion";
    public readonly contextValue = LogicAppVersionTreeItem.contextValue;

    public constructor(private readonly workflowVersion: WorkflowVersion) {
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

    public async getData(): Promise<string> {
        return JSON.stringify(this.workflowVersion.definition, null, 4);
    }
}
