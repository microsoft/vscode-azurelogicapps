import * as vscode from "vscode";
import { IAzureUserInput } from "vscode-azureextensionui";
import TelemetryReporter from "vscode-extension-telemetry";

export namespace ext {
    export let context: vscode.ExtensionContext;
    export let outputChannel: vscode.OutputChannel;
    export let reporter: TelemetryReporter | undefined;
    export let ui: IAzureUserInput;
}
