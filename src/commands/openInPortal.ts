import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export async function openInPortal(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    } else if (node.treeItem.contextValue !== LogicAppTreeItem.contextValue) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue, node);
    }

    node.openInPortal();
}
