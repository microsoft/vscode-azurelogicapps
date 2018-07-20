import * as vscode from "vscode";
import { AzureTreeDataProvider, BaseEditor, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export async function openInEditor(tree: AzureTreeDataProvider, editor: BaseEditor<IAzureNode<IAzureTreeItem>>, node?: IAzureNode<IAzureTreeItem>, preview = false): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    if (!preview) {
        await editor.showEditor(node);
    } else {
        const content = await (node.treeItem as LogicAppTreeItem).getData();
        const document = await vscode.workspace.openTextDocument({
            content,
            language: "json"
        });
        await vscode.window.showTextDocument(document);
    }
}
