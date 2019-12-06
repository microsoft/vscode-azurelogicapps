/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as http from "http";
import * as url from "url";
import { localize } from "../localize";

interface Deferred<T> {
    reject(reason: any): void;
    resolve(result: T | PromiseLike<T>): void;
}

interface RequestResponse {
    req: http.ServerRequest;
    res: http.ServerResponse;
}

interface CancelRequestResponse extends RequestResponse {
    message: string;
}

interface OkRequestResponse extends RequestResponse {
    consentServerCode: string;
    redirectUrl: string;
}

const authHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
</head>
<body>
</body>
</html>
`;

// @todo Do not forget to close the server when it is no longer in use, i.e., server.close([callback]);
// @todo Use a nonce to secure against replay attacks.
export function createServer() {
    let deferredCancel: Deferred<CancelRequestResponse>;
    const cancelPromise = new Promise((resolve, reject) => {
        deferredCancel = {
            reject,
            resolve
        };
    });

    let deferredOk: Deferred<OkRequestResponse>;
    const okPromise = new Promise((resolve, reject) => {
        deferredOk = {
            reject,
            resolve
        };
    });

    // @todo How to handle timeouts, e.g., when the user leaves the popup open for 5 minutes without finishing the authorization process?
    const server = http.createServer((req: http.ServerRequest, res: http.ServerResponse): void => {
        const requestUrl = url.parse(req.url!, /* parseQueryString */ true);
        switch (requestUrl.pathname) {
            // @todo Make a more presentable landing page rendered before opening the popup.
            case '/auth.html':
                const headers: http.OutgoingHttpHeaders = {
                    "Content-Length": authHtml.length,
                    "Content-Type": "text/html"
                };
                res.writeHead(200, headers);
                res.end(authHtml);
                break;

            case '/cancel':
                deferredCancel.resolve({
                    req,
                    res,
                    message: localize("azLogicApps.popupClosed", "The popup is closed.")
                });
                break;

            // @todo How do I pass the consent server code securely?
            case '/ok':
                const { consentServerCode, redirectUrl } = requestUrl.query;
                deferredOk.resolve({
                    req,
                    res,
                    consentServerCode,
                    redirectUrl
                });
                break;

            default:
                res.writeHead(404);
                res.end();
                break;
        }
    });

    return {
        cancelPromise,
        okPromise,
        server
    };
}

export function startServer(server: http.Server): Promise<number> {
    function clearPortTimeout(): void {
        if (portTimer) {
            clearTimeout(portTimer);
        }
    }

    let portTimer: NodeJS.Timer | undefined;

    const port = new Promise<number>((resolve, reject) => {
        portTimer = setTimeout(() => {
            reject(new Error(localize("azLogicApp.timeoutWaitingForPort", "Timeout waiting for port")));
        }, 5000);

        server.on("listening", () => {
            const address = server.address();
            resolve(address.port);
        });

        server.on("error", err => {
            reject(err);
        });

        server.on("close", () => {
            reject(new Error(localize("azLogicApps.serverClosed", "Server closed")));
        });

        server.listen(0, "127.0.0.1");
    });

    port.then(clearPortTimeout, clearPortTimeout);

    return port;
}
