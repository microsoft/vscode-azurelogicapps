/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface IUrlService {
    deserializeConnectionId(connectionId: string): string;
    getAntaresResourceBaseUri(): string;
    getApiOperationsUrl(apiType: string): string;
    getConfirmConsentCodeUri(connectionId: string): string;
    getConnectionId(connectionName: string, connectorId: string): string;
    getConnectionProvider(): string;
    getConnectionUri(): string;
    getConsentLinkUri(connectionId: string): string;
    getCustomConnectorsUri(): string;
    getFlowsConnectorPath(): string;
    getFlowsPath(): string;
    getGatewaysPath(): string;
    getInstallGatewayLink(): string;
    getListConnectionsUri(connectorId: string): string;
    getLocation(): string;
    getQueryForApiOperations(filter: string, apiType: string, apiVersion: string): Record<string, string>;
    getQueryForListConnections(apiVersion: string, apiName?: string): Record<string, string>;
    getResourceGroup(): string;
    getSubscriptionId(): string;

    /**
     * @deprecated
     */
    getUriForDynamicCalls(_: any, providerId: string, operationId: string, connectionId: string): string;

    serializeConnectionId(connectionId: string): string;
}

interface IUrlServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;
}

export class UrlService implements IUrlService {
    public constructor(private readonly options: IUrlServiceOptions) {
    }

    public deserializeConnectionId(): string {
        throw new Error("Not implemented");
    }

    public getAntaresResourceBaseUri(): string {
        throw new Error("Not implemented");
    }

    public getApiOperationsUrl(): string {
        throw new Error("Not implemented");
    }

    public getConfirmConsentCodeUri(): string {
        throw new Error("Not implemented");
    }

    public getConnectionId(connectionName: string): string {
        return `/connections/${connectionName}`;
    }

    public getConnectionProvider(): string {
        throw new Error("Not implemented");
    }

    public getConnectionUri(): string {
        throw new Error("Not implemented");
    }

    public getConsentLinkUri(): string {
        throw new Error("Not implemented");
    }

    public getCustomConnectorsUri(): string {
        throw new Error("Not implemented");
    }

    public getDynamicCallsUri(_connectorId: string, _operationId: string, connectionId: string): string {
        return `${this.options.baseUrl}/api/management${connectionId}/extensions/proxy`;
    }

    public getFlowsConnectorPath(): string {
        throw new Error("Not implemented");
    }

    public getFlowsPath(): string {
        throw new Error("Not implemented");
    }

    public getGatewaysPath(): string {
        throw new Error("Not implemented");
    }

    public getInstallGatewayLink(): string {
        throw new Error("Not implemented");
    }

    public getListConnectionsUri(): string {
        throw new Error("Not implemented");
    }

    public getLocation(): string {
        throw new Error("Not implemented");
    }

    public getQueryForApiOperations(): Record<string, string> {
        throw new Error("Not implemented");
    }

    public getQueryForListConnections(): Record<string, string> {
        throw new Error("Not implemented");
    }

    public getResourceGroup(): string {
        throw new Error("Not implemented");
    }

    public getSubscriptionId(): string {
        throw new Error("Not implemented");
    }

    public getUriForDynamicCalls(): string {
        throw new Error("Not implemented");
    }

    public serializeConnectionId(): string {
        throw new Error("Not implemented");
    }
}
