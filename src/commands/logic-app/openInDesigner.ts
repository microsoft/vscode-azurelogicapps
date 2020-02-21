/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode } from "vscode-azureextensionui";
import { ext } from "../../extensionVariables";
import { localize } from "../../localize";
import { LogicAppTreeItem } from "../../tree/logic-app/LogicAppTreeItem";
import { getAuthorization, getCredentialsMetadata } from "../../utils/authorizationUtils";
import { DialogResponses } from "../../utils/dialogResponses";
import { getCloudScriptPath, getWebviewContentForDesigner } from "../../utils/logic-app/designerUtils";

export async function openInDesigner(tree: AzureTreeDataProvider, node?: IAzureNode): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    const authorization = await getAuthorization(node.credentials);
    const { subscriptionId, treeItem } = node as IAzureNode<LogicAppTreeItem>;
    const callbacks = await treeItem.getCallbacks();
    const definition = await treeItem.getData(/* refresh */ true);
    const parameters = treeItem.getParameters();
    const references = await treeItem.getReferences();
    const { id: workflowId, integrationAccountId, label: workflowName, location, resourceGroupName, sku } = treeItem;
    const { domain: tenantId, userName: userId } = getCredentialsMetadata(node.credentials);
    const title = workflowName;

    const options: vscode.WebviewOptions & vscode.WebviewPanelOptions = {
        enableScripts: true,
        retainContextWhenHidden: true
    };
    const panel = vscode.window.createWebviewPanel("readonlyDesigner", title, vscode.ViewColumn.Beside, options);
    const cloudScriptPath = getCloudScriptPath(panel.webview);
    panel.webview.html = getWebviewContentForDesigner({
        authorization,
        callbacks,
        cloudScriptPath,
        definition,
        integrationAccountId,
        location,
        parameters,
        references,
        resourceGroupName,
        sku,
        subscriptionId,
        tenantId,
        title,
        userId,
        workflowId
    });
    panel.webview.onDidReceiveMessage(
        async message => {
            switch (message.command) {
                // @todo Start an HTTP server to listen for requests from the external window.
                case "OpenLoginPopup":
                    await vscode.env.openExternal(message.url);
                    break;

                case "OpenWindow":
                    await vscode.env.openExternal(message.url);
                    break;

                case "Save":
                    await handleSave(node! as IAzureNode<LogicAppTreeItem>, message.definition, message.parameters);
                    break;

                case "ShowError":
                    await vscode.window.showErrorMessage(message.errorMessage, DialogResponses.ok);
                    break;

                default:
                    break;
            }
        },
        /* thisArgs */ undefined,
        ext.context.subscriptions
    );
    panel.onDidDispose(
        () => {
            // @todo Shut down any HTTP servers listening for OAuth authorization popup requests.
        },
        /* thisArgs */ undefined,
        ext.context.subscriptions
    );
}

async function handleSave(node: IAzureNode<LogicAppTreeItem>, definition: string, parameters: Record<string, any> | undefined): Promise<string> {
    const options: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicApps.savingLogicApp", "Saving Logic App...")
    };

    return vscode.window.withProgress(options, async () => {
        try {
            const updatedDefinition = await node.treeItem.update(definition, parameters);
            await node.refresh();
            return updatedDefinition;
        } catch (error) {
            await vscode.window.showErrorMessage(error.message, DialogResponses.ok);
            throw error;
        }
    });
}
