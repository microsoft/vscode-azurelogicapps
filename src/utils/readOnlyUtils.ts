/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
    This functionality is more or less "cherry-picked" from package "vscode-azureextensionui".
    Currently we can not use it from there due to the fact that we depend on an old version.
    Once we move to a more recent version we should eventually remove this file and rewire the
    call sites to the "genuine" implementation.
*/

import { createHash } from "crypto";
import { isNullOrUndefined } from "util";
import { Event, EventEmitter, TextDocumentContentProvider, Uri, window, workspace } from "vscode";
import { ext } from "../extensionVariables";

let contentProvider: ReadOnlyContentProvider | undefined;
const providerScheme = "azurelogicappsReadonly";

export async function openReadOnlyJson(name: string, content: string): Promise<void> {
    return openReadOnlyContent(name, content, ".json");
}

export async function openReadOnlyContent(name: string, content: string, fileExt: string): Promise<void> {
    if (!contentProvider) {
        contentProvider = new ReadOnlyContentProvider();
        ext.context.subscriptions.push(
            workspace.registerTextDocumentContentProvider(providerScheme, contentProvider));
    }
    await contentProvider.openReadOnlyContent(name, content, fileExt);
}

class ReadOnlyContentProvider implements TextDocumentContentProvider {
    private _onDidChangeEmitter = new EventEmitter<Uri>();
    private _contentMap = new Map<string, string>();

    public get onDidChange(): Event<Uri> {
        return this._onDidChangeEmitter.event;
    }

    public async openReadOnlyContent(name: string, content: string, fileExt: string): Promise<void> {
        const nameHash = createHash("sha256").update(name).digest("hex");
        const uri = Uri.parse(`${providerScheme}:///${nameHash}/${name}${fileExt}`);
        this._contentMap.set(uri.toString(), content);
        await window.showTextDocument(uri);
        this._onDidChangeEmitter.fire(uri);
    }

    public async provideTextDocumentContent(uri: Uri): Promise<string> {
        const content = this._contentMap.get(uri.toString());
        if (isNullOrUndefined(content)) {
            throw new Error(
                "Internal error: Expected content from read-only provider to be neither null nor undefined");
        }
        return content;
    }
}