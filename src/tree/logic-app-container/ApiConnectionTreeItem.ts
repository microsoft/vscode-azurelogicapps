/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { Connection, ILogicAppsContainerClient } from "../../clients/LogicAppsContainerClient";
import { getIconPath } from "../../utils/nodeUtils";
import { TreeItemBase } from "./TreeItemBase";

export class ApiConnectionTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsConnection";
    public readonly contextValue: string = ApiConnectionTreeItem.contextValue;
    public readonly iconPath = getIconPath(ApiConnectionTreeItem.contextValue);

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly connection: Connection) {
        super(connection.name, vscode.TreeItemCollapsibleState.None);
    }

    public async delete(): Promise<void> {
        await this.client.deleteConnection(this.container.id, this.connection.id);
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.connection, null, 4);
    }

    public async update(connection: Connection): Promise<Connection> {
        return this.client.createOrUpdateConnection(this.container.id, this.connection.id, connection);
    }
}
