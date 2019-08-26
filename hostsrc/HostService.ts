/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface IHostService {
    canOpenAzureFunction?(resourceId: string): boolean;
    fetchAndDisplayContent?(identifier: string, title: string, url: string, type: ContentType): Promise<void>;
    getCallbackUrl?(triggerName: string): Promise<CallbackInfo>;
    onFullScreenParameterMode?(title: string, closeHandler: () => void): void;
    onRecommendationFullScreenModeChange?(isFullScreen: boolean, isCancelEnabled: boolean, cancelHandler: () => void): void;
    openAzureFunction?(resourceId: string): void;
    openMonitorView?(resourceId: string, runName: string, identifier: string): void;
    openWindow?(url: string): Promise<boolean>;
}

interface IHostServiceOptions {
    postMessage(message: any): void;
}

interface CallbackInfo {
    method: string;
    urlTemplate: string;
}

enum ContentType {
    Inputs,
    Outputs
}

export class HostService implements IHostService {
    public constructor(private readonly options: IHostServiceOptions) {
    }

    public async openWindow(url: string): Promise<boolean> {
        this.options.postMessage({
            command: "OpenWindow",
            url
        });

        return true;
    }
}
