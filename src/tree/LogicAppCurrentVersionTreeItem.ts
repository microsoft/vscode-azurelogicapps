/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAzureTreeItem } from "vscode-azureextensionui";
import { LogicAppVersionTreeItem } from "./LogicAppVersionTreeItem";

export class LogicAppCurrentVersionTreeItem extends LogicAppVersionTreeItem implements IAzureTreeItem {
    public static readonly contextValue: string = "azLogicAppsWorkflowCurrentVersion";
    public readonly contextValue: string = LogicAppCurrentVersionTreeItem.contextValue;

    public async promote(): Promise<void> {
        // tslint:disable-line: no-empty
    }
}
