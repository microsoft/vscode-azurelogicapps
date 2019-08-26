/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, LogicApp, Version } from "../../clients/LogicAppsContainerClient";
import { ConnectionReferences } from "../../utils/logic-app/connectionReferenceUtils";
import { getIconPath } from "../../utils/nodeUtils";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppVersionTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowVersion";
    public readonly contextValue: string = LogicAppVersionTreeItem.contextValue;
    public readonly iconPath = getIconPath(LogicAppVersionTreeItem.contextValue);

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly logicApp: LogicApp, private readonly version: Version) {
        super(version.name, vscode.TreeItemCollapsibleState.None);
    }

    public get containerBaseUrl(): string {
        return this.container.properties.baseUrl;
    }

    public get versionId(): string {
        return this.version.id;
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.version, null, 4);
    }

    public getDefinition(): string {
        return JSON.stringify(this.version.properties.definition, null, 4);
    }

    public getParameters(): Record<string, any> | undefined {
        return this.version.properties.parameters;
    }

    public async getReferences(): Promise<ConnectionReferences> {
        const { $connections } = this.version.properties.parameters;
        if ($connections === undefined) {
            return {};
        }

        const { value } = $connections;
        return value;
    }

    public async promote(): Promise<void> {
        await this.client.promoteVersion(this.container.id, this.logicApp.id, this.version.id);
    }
}
