/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { localize } from "../../localize";
import { LogicAppsContainerTreeDataProvider } from "../../tree/logic-app-container/LogicAppsContainerTreeDataProvider";

export async function connectToContainer(tree: LogicAppsContainerTreeDataProvider): Promise<void> {
    const inputBoxOptions: vscode.InputBoxOptions = {
        placeHolder: "http://localhost:9900",
        prompt: localize("azLogicAppContainers.promptForContainer", "Enter the Logic App container URL"),
        validateInput
    };
    const url = await vscode.window.showInputBox(inputBoxOptions);
    if (url === undefined) {
        return;
    }

    const progressOptions: vscode.ProgressOptions = {
        location: vscode.ProgressLocation.Notification,
        title: localize("azLogicAppContainers.connectingToContainer", "Connecting to Logic Apps container...")
    };
    await vscode.window.withProgress(progressOptions, async () => {
        await tree.connectToContainer(url);
    });
}

function validateInput(value: string): string {
    if (value === "") {
        return localize("azLogicAppContainers.containerUrlCannotBeEmpty", "The Logic App container URL cannot be an empty string.")
    }

    return "";
}
