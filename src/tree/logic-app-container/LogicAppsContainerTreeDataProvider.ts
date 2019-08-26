/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { callWithTelemetryAndErrorHandling } from "vscode-azureextensionui";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, ILogicAppsContainerClientOptions, LogicAppsContainerClient } from "../../clients/LogicAppsContainerClient";
import { Constants } from "../../constants";
import { LogicAppContainerTreeItem } from "./LogicAppContainerTreeItem";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppsContainerTreeDataProvider implements vscode.TreeDataProvider<TreeItemBase> {
    private readonly client: ILogicAppsContainerClient;
    private readonly onDidChangeTreeDataEventEmitter = new vscode.EventEmitter<TreeItemBase | null | undefined>();

    public readonly onDidChangeTreeData = this.onDidChangeTreeDataEventEmitter.event;

    public constructor(context: vscode.ExtensionContext) {
        const options: ILogicAppsContainerClientOptions = {
            apiVersion: Constants.ContainerApiVersion
        };
        this.client = new LogicAppsContainerClient(context, options);
    }

    public async connectToContainer(containerId: string): Promise<void> {
        const container: Container = {
            id: containerId,
            name: containerId,
            properties: {
                baseUrl: containerId,
            },
            type: "Microsoft.Logic/containers"
        };

        await this.client.createOrUpdateContainer(containerId, container);
        this.refresh();
    }

    public async getChildren(element?: TreeItemBase): Promise<TreeItemBase[]> {
        if (element === undefined) {
            const { value } = await this.client.getContainers();
            return value.map((container: Container) => new LogicAppContainerTreeItem(this.client, container));
        }

        return callWithTelemetryAndErrorHandling("LogicAppsContainerTreeDataProvider.getChildren", async (): Promise<TreeItemBase[]> => {
            return element.getChildren();
        });
    }

    public getTreeItem(element: TreeItemBase): vscode.TreeItem {
        return {
            id: element.id,
            collapsibleState: element.collapsibleState,
            command: element.command,
            contextValue: element.contextValue,
            iconPath: element.iconPath,
            label: element.label
        };
    }

    public async loadMore(element: TreeItemBase): Promise<void> {
        return callWithTelemetryAndErrorHandling("LogicAppsContainerTreeDataProvider.loadMore", async (): Promise<void> => {
            try {
                await element.loadMore();
            } finally {
                this.refresh(element);
            }
        });
    }

    public refresh(element?: TreeItemBase): void {
        this.onDidChangeTreeDataEventEmitter.fire(element);
    }

    public async showNodePicker<T extends TreeItemBase>(expectedContextValue: string, startingNode?: TreeItemBase): Promise<T | undefined> {
        const quickPickOptions: vscode.QuickPickOptions = {
            canPickMany: false
        };

        let selectedItem: TreeItemBase | undefined = startingNode;
        do {
            const children = await this.getChildren(selectedItem);
            const items = mapToQuickPickItems(children);
            const selectedQuickPick = await vscode.window.showQuickPick(items, quickPickOptions);
            if (selectedQuickPick === undefined) {
                return undefined;
            }

            selectedItem = children.find(child => child.label === selectedQuickPick.label);
        } while (selectedItem !== undefined && selectedItem.contextValue !== expectedContextValue);

        return selectedItem as T;
    }
}

function mapToQuickPickItems(items: TreeItemBase[]): vscode.QuickPickItem[] {
    return items.map(({ label }: TreeItemBase) => ({ label }));
}
