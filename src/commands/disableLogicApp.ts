import { AzureTreeDataProvider, IAzureNode, IAzureTreeItem } from "vscode-azureextensionui";
import { localize } from "../localize";
import { LogicAppTreeItem } from "../tree/LogicAppTreeItem";

export async function disableLogicApp(tree: AzureTreeDataProvider, node?: IAzureNode<IAzureTreeItem>): Promise<void> {
    if (!node) {
        node = await tree.showNodePicker(LogicAppTreeItem.contextValue);
    }

    await node.runWithTemporaryDescription(
        localize("azLogicApps.disabling", "Disabling..."),
        async () => {
            const logicAppTreeItem = node!.treeItem as LogicAppTreeItem;
            await logicAppTreeItem.disable();
        }
    );
}
