/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { getThemedIconPath } from "../../utils/nodeUtils";

export abstract class TreeItemBase extends vscode.TreeItem {
    public constructor(public readonly label: string, public readonly collapsibleState: vscode.TreeItemCollapsibleState, public readonly command?: vscode.Command) {
        super(label, collapsibleState);
    }

    public get tooltip(): string {
        return this.label;
    }

    public async getChildren(): Promise<TreeItemBase[]> {
        return [];
    }

    public hasMoreChildren(): boolean {
        return false;
    }

    public async loadMore(): Promise<void> {
    }

    protected includeLoadMoreConditionally(elements: TreeItemBase[], nextLink: string | undefined): TreeItemBase[] {
        return nextLink !== undefined
            ? [...elements, new LoadMoreTreeItem(this)]
            : elements;
    }
}

class LoadMoreTreeItem extends TreeItemBase {
    public constructor(parent: TreeItemBase) {
        const title = localize("azLogicAppContainers.loadMore", "Load more...");
        const command = {
            command: "azLogicAppContainers.loadMore",
            title
        };
        super(title, vscode.TreeItemCollapsibleState.None, command);
        this.command!.arguments = [parent];
        this.iconPath = getThemedIconPath("Refresh");
    }
}
