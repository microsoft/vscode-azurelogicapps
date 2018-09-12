/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureTreeDataProvider, IAzureParentNode } from "vscode-azureextensionui";

export async function createLogicApp(tree: AzureTreeDataProvider, subscription?: IAzureParentNode, resourceGroup?: string): Promise<string> {
    const node = !subscription
        ? await tree.showNodePicker(AzureTreeDataProvider.subscriptionContextValue) as IAzureParentNode
        : subscription;

    const logicAppNode = await node.createChild({ resourceGroup });
    return logicAppNode.id;
}
