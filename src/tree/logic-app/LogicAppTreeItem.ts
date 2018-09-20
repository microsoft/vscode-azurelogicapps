/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { Workflow } from "azure-arm-logic/lib/models";
import { WebResource } from "ms-rest";
import * as request from "request-promise-native";
import { IAzureParentTreeItem, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../../localize";
import { getIconPath } from "../../utils/nodeUtils";
import { LogicAppRunsTreeItem } from "./LogicAppRunsTreeItem";
import { LogicAppTriggersTreeItem } from "./LogicAppTriggersTreeItem";
import { LogicAppVersionsTreeItem } from "./LogicAppVersionsTreeItem";

export class LogicAppTreeItem implements IAzureParentTreeItem {
    public static contextValue = "azLogicAppsWorkflow";
    public readonly childTypeLabel: string = localize("azLogicApps.child", "Child");
    public contextValue = LogicAppTreeItem.contextValue;
    public logicAppRunsItem: LogicAppRunsTreeItem;
    public logicAppTriggersItem: LogicAppTriggersTreeItem;
    public logicAppVersionsItem: LogicAppVersionsTreeItem;

    public constructor(private readonly client: LogicAppsManagementClient, private workflow: Workflow) {
        this.logicAppRunsItem = new LogicAppRunsTreeItem(client, workflow);
        this.logicAppTriggersItem = new LogicAppTriggersTreeItem(client, workflow);
        this.logicAppVersionsItem = new LogicAppVersionsTreeItem(client, workflow);
    }

    public get iconPath(): string {
        return getIconPath(LogicAppTreeItem.contextValue);
    }

    public get id(): string {
        return this.workflow.id!;
    }

    public get label(): string {
        return this.workflow.name!;
    }

    public get resourceGroupName(): string {
        return this.workflow.id!.split("/").slice(-5, -4)[0];
    }

    public get workflowName(): string {
        return this.workflow.name!;
    }

    public hasMoreChildren(): boolean {
        return false;
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.workflows.deleteMethod(this.resourceGroupName, this.workflowName);
    }

    public async disable(): Promise<void> {
        await this.client.workflows.disable(this.resourceGroupName, this.workflowName);
    }

    public async enable(): Promise<void> {
        await this.client.workflows.enable(this.resourceGroupName, this.workflowName);
    }

    public async getData(refresh = false): Promise<string> {
        if (refresh) {
            this.workflow = await this.client.workflows.get(this.resourceGroupName, this.workflowName);
        }

        return JSON.stringify(this.workflow.definition, null, 4);
    }

    public async loadMoreChildren(): Promise<IAzureTreeItem[]> {
        return [
            this.logicAppRunsItem,
            this.logicAppTriggersItem,
            this.logicAppVersionsItem
        ];
    }

    public pickTreeItem(expectedContextValue: string): IAzureTreeItem | undefined {
        switch (expectedContextValue) {
            case LogicAppRunsTreeItem.contextValue:
                return this.logicAppRunsItem;

            case LogicAppTriggersTreeItem.contextValue:
                return this.logicAppTriggersItem;

            case LogicAppVersionsTreeItem.contextValue:
                return this.logicAppVersionsItem;

            default:
                return undefined;
        }
    }

    // NOTE(joechung): Do the update request manually instead of using the SDK to work around #25.
    public async update(definition: string): Promise<string> {
        const workflow = {
            id: this.id,
            location: this.workflow.location!,
            name: this.workflowName,
            properties: {
                ...this.workflow,
                definition: JSON.parse(definition)
            },
            tags: this.workflow.tags || {},
            type: this.workflow.type!
        };
        delete workflow.properties.id;
        delete workflow.properties.location;
        delete workflow.properties.name;
        delete workflow.properties.tags;
        delete workflow.properties.type;

        const authorization = await new Promise<string>((resolve, reject) => {
            const webResource = new WebResource();
            this.client.credentials.signRequest(webResource, (err: Error | undefined): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(webResource.headers.authorization);
                }
            });
        });

        const uri = `https://management.azure.com/subscriptions/${this.client.subscriptionId}/resourceGroups/${this.resourceGroupName}/providers/Microsoft.Logic/workflows/${this.workflowName}?api-version=${this.client.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            body: JSON.stringify(workflow),
            headers: {
                "Authorization": authorization,
                "Content-Type": "application/json"
            },
            method: "PUT"
        };
        const response = await request(uri, options);
        const updatedWorkflow = JSON.parse(response);

        return JSON.stringify(updatedWorkflow.properties.definition, null, 4);
    }
}
