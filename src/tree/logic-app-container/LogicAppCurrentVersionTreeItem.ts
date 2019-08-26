/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { LogicAppVersionTreeItem } from "./LogicAppVersionTreeItem";

export class LogicAppCurrentVersionTreeItem extends LogicAppVersionTreeItem implements vscode.TreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowCurrentVersion";
    public readonly contextValue: string = LogicAppCurrentVersionTreeItem.contextValue;
}
