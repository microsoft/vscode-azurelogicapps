import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export async function deleteLogicApp(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azLogicApp.deleting", "Deleting..."),
        async () => {
            await node!.deleteNode();
        }
    );
}
