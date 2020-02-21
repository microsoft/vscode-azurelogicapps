/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IOAuthService {
    openLoginPopup(): OAuthPopupInstance;
}

interface LoginResult {
    error?: string;
}

interface OAuthPopupInstance {
    closed: boolean;

    // @todo What is this used for?  Do we need it?
    connectionId?: string;

    loginPromise: Promise<LoginResult>;

    url: string;

    // @todo Is there a way to close the openExternal window?  If not, make this a no-op.
    close(): void;

    // @todo How is this used?  Where is it set?
    getRedirectUrl(): string;
}

interface OAuthPopupOptions {
    eventTarget: EventTarget;
    postMessage(message: any): void;
}

export interface OAuthServiceOptions {
    eventTarget: EventTarget;
    postMessage(message: any): void;
}

export class OAuthService implements IOAuthService {
    constructor(private options: OAuthServiceOptions) {
    }

    public openLoginPopup(): OAuthPopupInstance {
        const { eventTarget, postMessage } = this.options;
        const oauthPopup = new OAuthPopup({ eventTarget, postMessage });
        return oauthPopup;
    }
}

class OAuthPopup implements OAuthPopupInstance {
    public closed: boolean;
    public connectionId?: string;
    public loginPromise: Promise<LoginResult>;
    private _resolve: ((value?: LoginResult | PromiseLike<LoginResult>) => void) | undefined;
    private _redirectUrl: string;
    private _url: string;

    constructor(private options: OAuthPopupOptions) {
        this.closed = false;
        this.loginPromise = new Promise<LoginResult>(resolve => {
            this._resolve = resolve;
        });

        // @todo Change this to the URL of a page hosted on the HTTP server started by the extension?
        this._redirectUrl = "https://ema.hosting.portal.azure.net/ema/Content/1.41216.1.4.200106-1403/Html/authredirect.html?trustedAuthority=https%3A%2F%2Fms.portal.azure.com";
        this._url = "";

        this.options.eventTarget.addEventListener("message", this._handleMessage);
    }

    public get url(): string {
        return this._url;
    }

    public set url(url: string) {
        this._url = url;

        this.options.postMessage({
            command: "OpenLoginPopup",
            url
        });
    }

    // Visual Studio Code does not support closing windows opened with vscode.env.openExternal.
    public close(): void {
        this.closed = true;
    }

    public getRedirectUrl(): string {
        return this._redirectUrl;
    }

    // Handle messages posted by the extension to the Webview window when the openExternal window processes actions in the authorization popup.
    private _handleMessage = ({ data }: any): void => {
        switch (data.command) {
            // When the extension receives an "/ok" request, it will post a "LoginComplete" message with a consent server code.
            case "LoginComplete":
                this.close();
                this._redirectUrl = data.redirectUrl;
                this._resolve!({});
                break;

            // When the extension receives a "/cancel" request, it will post a "LoginCancelled" message.
            case "LoginCancelled":
                this.close();
                this._resolve!({
                    error: "The popup is closed."
                });
                break;

            // When the extension has not received an "/ok" or "/cancel" request in 180 seconds, it will post a "LoginTimeOut" message.
            case "LoginTimeOut":
                this.close();
                this._resolve!({
                    error: "The popup has timed out."
                });
                break;

            default:
                break;
        }
    };
}
