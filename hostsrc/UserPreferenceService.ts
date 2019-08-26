/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface IUserPreferenceService {
    getMostRecentlyUsedConnectionId(connectorId: string): Promise<string | undefined>;
    setMostRecentlyUsedConnectionId(connectorId: string, connectionId: string): Promise<string | undefined>;
}

// NOTE(joechung): Webviews in Visual Studio Code extensions do not support local storage so implement this service with no-ops.
export class UserPreferenceService implements IUserPreferenceService {
    async getMostRecentlyUsedConnectionId(): Promise<string | undefined> {
        return "";
    }

    async setMostRecentlyUsedConnectionId(): Promise<string | undefined> {
        return "";
    }
}
