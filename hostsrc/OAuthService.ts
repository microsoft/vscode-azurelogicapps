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
    connectionId?: string;
    loginPromise: Promise<LoginResult>;
    url: string;
    close(): void;
    getRedirectUrl(): string;
}

export class OAuthService implements IOAuthService {
    openLoginPopup(): OAuthPopupInstance {
        return new OAuthPopup();
    }
}

/**
 * OAuthPopup should:
 * - Start an HTTP server listening to an open port.
 * - Host an /index.html page which serves a Web page which opens the authorization popup.
 * - Have an event handler listen for the popup to authorize and issue an "/ok" request when this happens.
 * - Have an event handler listen for the popup to close and issue a "/cancel" request when this happens.
 * - (Edge/IE) Have an event handler wait for 180 seconds and issue a "/timeout" request.
 *
 * /ok should set `_redirectUrl` and set `loginPromise` to a resolved `Promise` with a `LoginResult` object with no error message.
 * /cancel should call `close()` and set `loginPromise` to a resolved `Promise` with a `LoginResult` object with `error` set to "The popup is closed."
 * /timeout should call `close()` and set `loginPromise` to a resolved `Promise` with a `LoginResult` object with `error` set to "The popup has timed out."
 */
class OAuthPopup implements OAuthPopupInstance {
    public closed: boolean;
    public loginPromise: Promise<LoginResult>;
    public url: string;
    private _redirectUrl: string;

    public constructor() {
        this.closed = false;
        this.loginPromise = Promise.resolve({});
        this.url = "";
        this._redirectUrl = "";
    }

    close(): void {
        this.closed = true;
    }

    getRedirectUrl(): string {
        return this._redirectUrl;
    }
}
