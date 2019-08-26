/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, LogicApp } from "../../clients/LogicAppsContainerClient";
import { getCallbacks } from "../../utils/logic-app-container/callbackUtils";
import { Callbacks } from "../../utils/logic-app/callbackUtils";
import { ConnectionReferences } from "../../utils/logic-app/connectionReferenceUtils";
import { getIconPath } from "../../utils/nodeUtils";
import { LogicAppRunsTreeItem } from "./LogicAppRunsTreeItem";
import { LogicAppTriggersTreeItem } from "./LogicAppTriggersTreeItem";
import { LogicAppVersionsTreeItem } from "./LogicAppVersionsTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflow";
    public readonly contextValue: string = LogicAppTreeItem.contextValue;
    public readonly iconPath = getIconPath(LogicAppTreeItem.contextValue);

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, public readonly logicApp: LogicApp) {
        super(logicApp.name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public get containerBaseUrl(): string {
        return this.container.properties.baseUrl;
    }

    public get logicAppId(): string {
        return this.logicApp.id;
    }

    public async delete(): Promise<void> {
        await this.client.deleteLogicApp(this.container.id, this.logicApp.id);
    }

    public async disable(): Promise<void> {
        await this.client.disableLogicApp(this.container.id, this.logicApp.id);
    }

    public async enable(): Promise<void> {
        await this.client.enableLogicApp(this.container.id, this.logicApp.id);
    }

    public async getCallbacks(): Promise<Callbacks> {
        const { definition } = this.logicApp.properties;
        const { value: triggers } = await this.client.getTriggersByLogicApp(this.container.id, this.logicApp.id);
        return getCallbacks(this.client, this.container.id, definition, this.logicApp.id, triggers);
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        return [
            new LogicAppRunsTreeItem(this.client, this.container, this.logicApp),
            new LogicAppTriggersTreeItem(this.client, this.container, this.logicApp),
            new LogicAppVersionsTreeItem(this.client, this.container, this.logicApp)
        ];
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.logicApp, null, 4);
    }

    public getDefinition(): string {
        return JSON.stringify(this.logicApp.properties.definition, null, 4);
    }

    public getParameters(): Record<string, any> | undefined {
        return this.logicApp.properties.parameters;
    }

    public async getReferences(): Promise<ConnectionReferences> {
        const { $connections } = this.logicApp.properties.parameters;
        return $connections !== undefined
            ? $connections.value
            : undefined;
    }

    public async update(logicApp: LogicApp): Promise<LogicApp> {
        return this.client.createOrUpdateLogicApp(this.container.id, this.logicApp.id, logicApp);
    }

    public async updateDefinitionAndParameters(definition: string, parameters: Record<string, any> | undefined): Promise<LogicApp> {
        parameters = removeAuthenticationParameter(parameters);

        const updatedLogicApp = {
            ...this.logicApp,
            properties: {
                ...this.logicApp.properties,
                definition: JSON.parse(definition),
                parameters
            }
        };

        return this.update(updatedLogicApp);
    }
}

function removeAuthenticationParameter(parameters: Record<string, any> | undefined): Record<string, any> | undefined {
    if (parameters === undefined) {
        return parameters;
    }

    parameters = { ...parameters };
    delete parameters.$authentication;
    return parameters;
}
