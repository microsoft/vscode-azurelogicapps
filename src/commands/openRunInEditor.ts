import * as vscode from "vscode";
import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { LogicAppRunTreeItem } from "../tree/LogicAppRunTreeItem";

export async function openRunInEditor(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppRunTreeItem.contextValue);
    }

    const content = await (node.treeItem as LogicAppRunTreeItem).getData();
    const document = await vscode.workspace.openTextDocument({
        content,
        language: "json"
    });
    await vscode.window.showTextDocument(document);
}
