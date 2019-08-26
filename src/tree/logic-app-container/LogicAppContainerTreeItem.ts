/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { Connection, ILogicAppsContainerClient, LogicApp } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { getIconPath } from "../../utils/nodeUtils";
import { ApiConnectionTreeItem } from "./ApiConnectionTreeItem";
import { LogicAppTreeItem } from "./LogicAppTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppContainerTreeItem extends TreeItemBase {
    public static readonly contextValue: string = "azLogicAppsContainer";
    public readonly contextValue: string = LogicAppContainerTreeItem.contextValue;
    public readonly iconPath = getIconPath(LogicAppContainerTreeItem.contextValue)

    public constructor(private readonly client: ILogicAppsContainerClient, public readonly container: Container) {
        super(container.name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async createLogicAppChild(): Promise<LogicAppTreeItem | undefined> {
        const inputBoxOptions: vscode.InputBoxOptions = {
            prompt: localize("azLogicAppContainers.promptForLogicAppName", "Enter the name of the new Logic App"),
            validateInput: async (value: string): Promise<string> => {
                if (value === "") {
                    return localize("azLogicAppContainers.logicAppNameCannotBeEmpty", "The Logic App name cannot be an empty string.")
                }

                try {
                    await this.client.getLogicApp(this.container.id, `/workflows/${value}`);
                    return localize("azLogicAppContainers.logicAppNameAlreadyInUse", "The Logic App name is already in use. Please try another name.");
                } catch (error) {
                    if (error.name === "StatusCodeError" && error.statusCode === 404) {
                        return "";
                    } else {
                        throw error;
                    }
                }

                return "";
            }
        };
        const logicAppName = await vscode.window.showInputBox(inputBoxOptions);
        if (logicAppName === undefined) {
            return;
        }

        const progressOptions: vscode.ProgressOptions = {
            location: vscode.ProgressLocation.Notification,
            title: localize("azLogicAppContainers.creatingLogicApp", "Creating Logic App...")
        };
        return vscode.window.withProgress(progressOptions, async () => {
            const logicApp = await this.client.createOrUpdateLogicApp(this.container.id, `/workflows/${logicAppName}`, makeNewLogicApp(logicAppName));
            return new LogicAppTreeItem(this.client, this.container, logicApp);
        });
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        const [connections, logicApps] = await Promise.all([
            this.getConnections(),
            this.getLogicApps()
        ]);

        const children = [...connections, ...logicApps];
        if (children.length === 0) {
            return [
                new CreateLogicAppTreeItem(this)
            ];
        }

        children.sort(byLabel);

        return children;
    }

    public async delete(): Promise<void> {
        return this.client.deleteContainer(this.container.id);
    }

    public async update(container: Container): Promise<Container> {
        return this.client.createOrUpdateContainer(this.container.id, container);
    }

    private async getConnections(): Promise<ApiConnectionTreeItem[]> {
        const { value } = await this.client.getConnectionsByContainer(this.container.id);
        return value.map((connection: Connection) => new ApiConnectionTreeItem(this.client, this.container, connection));
    }

    private async getLogicApps(): Promise<LogicAppTreeItem[]> {
        const { value } = await this.client.getLogicAppsByContainer(this.container.id);
        return value.map((logicApp: LogicApp) => new LogicAppTreeItem(this.client, this.container, logicApp));
    }
}

class CreateLogicAppTreeItem extends TreeItemBase {
    public constructor(parent: TreeItemBase) {
        const title = localize("azLogicAppContainers.noLogicApps", "There are no Logic Apps. Click to create a Logic App...");
        const command = {
            command: "azLogicAppContainers.createLogicApp",
            title
        };
        super(title, vscode.TreeItemCollapsibleState.None, command);
        this.command!.arguments = [parent];
    }
}

function byLabel(a: TreeItemBase, b: TreeItemBase): number {
    const aLabel = a.label;
    const bLabel = b.label;

    if (aLabel < bLabel) {
        return -1;
    } else if (aLabel > bLabel) {
        return 1;
    } else {
        return 0;
    }
}

function makeNewLogicApp(logicAppId: string): LogicApp {
    return {
        id: logicAppId,
        name: logicAppId,
        properties: {
            definition: {
                $schema: "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
                actions: {},
                contentVersion: "1.0.0.0",
                outputs: {},
                parameters: {},
                triggers: {}
            },
            parameters: {}
        },
        type: "workflows"
    };
}
