/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServiceClientCredentials, WebResource } from "ms-rest";

export interface CredentialsMetadata {
    domain: string;
    userName: string;
}

export function getAuthorization(credentials: ServiceClientCredentials): Promise<string> {
    return new Promise((resolve, reject) => {
        const webResource = new WebResource();
        credentials.signRequest(webResource, (err: Error | undefined): void => {
            if (err) {
                reject(err);
            } else {
                resolve(webResource.headers.authorization);
            }
        });
    });
}

export function getCredentialsMetadata(credentials: ServiceClientCredentials): CredentialsMetadata {
    return credentials as unknown as CredentialsMetadata;
}
