/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { Container } from "../../clients/ContainerClient";
import { ILogicAppsContainerClient, Trigger } from "../../clients/LogicAppsContainerClient";
import { runTrigger } from "../../utils/logic-app-container/callbackUtils";
import { getThemedIconPath } from "../../utils/nodeUtils";
import { TreeItemBase } from "./TreeItemBase";

export class LogicAppTriggerTreeItem extends TreeItemBase implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowTrigger";
    public readonly contextValue: string = LogicAppTriggerTreeItem.contextValue;
    public readonly iconPath = getThemedIconPath("Trigger");

    public constructor(private readonly client: ILogicAppsContainerClient, private readonly container: Container, private readonly trigger: Trigger) {
        super(trigger.name, vscode.TreeItemCollapsibleState.None);
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.trigger, null, 4);
    }

    public async run(): Promise<void> {
        return runTrigger(this.client, this.container.id, this.trigger.id);
    }
}
