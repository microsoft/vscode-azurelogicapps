/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { RunAction } from "../../clients/LogicAppsContainerClient";
import { localize } from "../../localize";
import { getStatusIconPath } from "../../utils/nodeUtils";
import { TreeItemBase } from "./TreeItemBase";

const command = "azLogicAppContainers.openRunActionInEditor";
const title = localize("azureLogicApps.openInEditor", "Open in Editor");

export class LogicAppRunActionTreeItem extends TreeItemBase {
    public static readonly contextValue: string = "azLogicAppsWorkflowRunAction";
    public readonly contextValue: string = LogicAppRunActionTreeItem.contextValue;

    public constructor(public readonly runAction: RunAction) {
        super(runAction.name, vscode.TreeItemCollapsibleState.None, { command, title });
        this.command!.arguments = [this];
    }

    public get iconPath(): string {
        return getStatusIconPath(this.runAction.properties.status);
    }

    public async getData(): Promise<string> {
        return JSON.stringify(this.runAction, null, 4);
    }
}
