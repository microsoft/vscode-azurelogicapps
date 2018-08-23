/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { IntegrationAccountMapTreeItem, MapType } from "../tree/integration-account/IntegrationAccountMapTreeItem";
import { openAndShowTextDocument } from "../utils/commandUtils";

// XXX Unused
export async function openMapInEditor(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(IntegrationAccountMapTreeItem.contextValue);
    }

    const map = node.treeItem as IntegrationAccountMapTreeItem;
    const mapData = await map.getData();

    if (map.mapType === MapType.Liquid) {
        await openAndShowTextDocument(mapData, "text");
    } else {
        await openAndShowTextDocument(mapData, "xml");
    }

}
