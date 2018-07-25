import * as vscode from "vscode";

export async function openAndShowTextDocument(content: string, language = "json") {
    const document = await vscode.workspace.openTextDocument({
        content,
        language
    });
    await vscode.window.showTextDocument(document);
}
