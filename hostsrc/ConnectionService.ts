/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IOAuthService } from "./OAuthService";

interface IConnectionService {
    oauthService: IOAuthService;
    confirmConsentCode(connectionId: string, code: string): Promise<any>; // tslint:disable-line: no-any
    consentFirstPartyConnection(url: string): Promise<HttpResponse<string>>;
    createConnection(connectionId: string, connectorId: string, properties?: ConnectionProperties): Promise<Connection>;
    createDependentConnection(dependentConnectionId: string, dependentConnectorId: string, prerequisiteConnectionId: string, key: string, runtimeUrl: string): Promise<Connection>;
    deleteConnection(connectionId: string): Promise<void>;
    dispose(): void;
    getCoauthoredConnections(connectorId?: string, batchable?: boolean): Promise<Connection[]>;
    getConnection(connectionId: string, batchable?: boolean): Promise<Connection>;
    getConnectionProvidersWithCapability(capability: string, batchable?: boolean): Promise<ManagedApi[]>;
    getConnections(connectorId?: string, batchable?: boolean): Promise<Connection[]>;
    getConnector(connectorId: string, batchable?: boolean): Promise<ManagedApi>;
    getConnectors(batchable?: boolean): Promise<ManagedApi[]>;
    getConsentUri(connectionId: string, redirectUri: string, parameterName?: string): Promise<string>;
    getFirstPartyLoginUri(connectionId: string, parameterName?: string): Promise<string>;
    getGatewayName?<T extends Connection>(connection: T): string | undefined;
    getGateways(apiNameFilter: string): Promise<Gateway[]>;
    getNewConnectionName(connectorId: string, designerContext: any): Promise<string>;
    init(connections: Connection[]): Connection[];
    isCoauthoredConnection?(connection: Connection): boolean;
    refresh(): void;
    showViewPermissionsDialog?(connector: ManagedApi): void;
    testConnection(connection: Connection): Promise<void>;
    updateConnectionProviders(connectors: ManagedApi[]): ManagedApi[];
}

interface IConnectionServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;

    oauthService: IOAuthService;
}

interface Connection {
    id: string;
    name: string;
    properties: ConnectionProperties;
    type: "connections";
}

interface ConnectionParameter {
}

interface ConnectionProperties {
    connectionParameters?: Record<string, any>;
    connectionParametersSet?: Record<string, any>;
    displayName?: string;
    testLinks?: ConnectionTestLink[];
}

interface ConnectionTestLink {
    method: string;
    requestUri: string;
}

interface Gateway {
}

export interface ManagedApi {
    id: string;
    name: string;
    properties: ManagedApiProperties;
    type: "managedApis";
}

export interface ManagedApiOperation {
    id: string;
    name: string;
    properties: ManagedApiOperationProperties;
    type: "managedApis/apiOperations";
}

interface ManagedApiOperationProperties {
    annotation?: {
        status: string;
    };
    api: {
        brandColor: string;
        description: string;
        displayName: string;
        iconUri: string;
        id: string;
        name: string;
    };
    description: string;
    summary: string;
    visibility: string;
}

interface ManagedApiProperties {
    capabilities?: string[];
    connectionParameters: Record<string, ConnectionParameter>;
    generalInformation: {
        description: string;
        displayName: string;
        iconUrl: string;
    };
    metadata: {
        brandColor: string;
        source: string;
    };
    name: string;
    swagger?: any;
}

interface Headers {
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callbackFn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
}

interface HttpResponse<T> {
    body?: T;
    headers: Headers | Record<string, string>;
    ok: boolean;
    status: number;
    url: string;
}

const collator = new Intl.Collator("en-US", { sensitivity: "base" });

export class ConnectionService implements IConnectionService {
    public constructor(private readonly options: IConnectionServiceOptions) {
    }

    public get oauthService(): IOAuthService {
        return this.options.oauthService;
    }

    public async confirmConsentCode(): Promise<any> {
        throw new Error("Not implemented");
    }

    public async consentFirstPartyConnection(): Promise<HttpResponse<string>> {
        throw new Error("Not implemented");
    }

    public async createConnection(connectionId: string, connectorId: string, properties?: ConnectionProperties): Promise<Connection> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${connectionId}?api-version=${apiVersion}`;
        const body = getRequestBodyForCreateConnection(connectorId, properties);
        const init: RequestInit = {
            body,
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT"
        };
        const response = await fetch(input, init);
        const connection = await response.json();
        const normalizedConnection = normalizeConnection(connection);
        return normalizedConnection;
    }

    public async createDependentConnection(): Promise<Connection> {
        throw new Error("Not implemented");
    }

    public async deleteConnection(connectionId: string): Promise<void> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${connectionId}?api-version=${apiVersion}`;
        const init: RequestInit = {
            method: "DELETE"
        };
        await fetch(input, init);
    }

    public dispose(): void {
    }

    public async getCoauthoredConnections(): Promise<Connection[]> {
        return [];
    }

    public async getConnection(connectionId: string): Promise<Connection> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${connectionId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const connection = await response.json();
        return normalizeConnection(connection);
    }

    public async getConnectionProvidersWithCapability(capability: string): Promise<ManagedApi[]> {
        const connectors = await this.getConnectors();
        return connectors.filter(connectorHasCapability(capability));
    }

    // NOTE(joechung): This API does not follow continuations nor is there an API to follow continuations.
    public async getConnections(connectorId?: string): Promise<Connection[]> {
        interface ConnectionsResponse {
            nextLink?: string;
            value: Connection[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = connectorId === undefined
            ? `${baseUrl}/api/management/connections?api-version=${apiVersion}`
            : `${baseUrl}/api/management/connections?api-version=${apiVersion}&$filter=ManagedApiName eq '${getManagedApiNameFromConnectorId(connectorId)}'`;
        const response = await fetch(input);
        const { value }: ConnectionsResponse = await response.json();
        const connections = value.map(normalizeConnection);
        return connections;
    }

    public async getConnector(connectorId: string): Promise<ManagedApi> {
        const [connector, swagger] = await Promise.all([
            this._getConnector(connectorId),
            this._getConnectorSwagger(connectorId)
        ]);

        return {
            ...connector,
            properties: {
                ...connector.properties,
                swagger
            }
        };
    }

    private async _getConnector(connectorId: string): Promise<ManagedApi> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${connectorId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const managedApi = await response.json();
        return normalizeConnector(managedApi);
    }

    private async _getConnectorSwagger(connectorId: string): Promise<any> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${connectorId}?api-version=${apiVersion}&export=true`;
        const response = await fetch(input);
        return response.json();
    }

    // NOTE(joechung): This API does not follow continuations nor is there an API to follow continuations.
    public async getConnectors(): Promise<ManagedApi[]> {
        interface ConnectorsResponse {
            nextLink?: string;
            value: ManagedApi[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management/managedApis?api-version=${apiVersion}`;
        const response = await fetch(input);
        const { value }: ConnectorsResponse = await response.json();
        const managedApis = value.map(normalizeConnector);
        return managedApis;
    }

    public async getConsentUri(): Promise<string> {
        throw new Error("Not implemented");
    }

    public async getFirstPartyLoginUri(): Promise<string> {
        throw new Error("Not implemented");
    }

    public async getGateways(): Promise<Gateway[]> {
        throw new Error("Not implemented");
    }

    public async getNewConnectionName(): Promise<string> {
        throw new Error("Not implemented");
    }

    public async getUniqueConnectionName(_connectorId: string, connectionNames: string[], connectorName: string): Promise<string> {
        const set = new Set(connectionNames);

        let i = 1;
        let connectionName = connectorName;
        while (set.has(connectionName)) {
            connectionName = `${connectorName}-${++i}`;
        }

        return this.findUniqueConnectionName(connectorName, connectionName, i);
    }

    public init(connections: Connection[]): Connection[] {
        return connections;
    }

    public refresh(): void {
    }

    public async testConnection(connection: Connection): Promise<void> {
        const { testLinks } = connection.properties;
        if (testLinks === undefined) {
            return;
        }

        const [testLink] = testLinks;
        if (testLink === undefined) {
            return;
        }

        const { method, requestUri } = testLink;
        const init: RequestInit = {
            method
        };

        await fetch(requestUri, init);
    }

    public updateConnectionProviders(connectors: ManagedApi[]): ManagedApi[] {
        return connectors.map(normalizeConnector);
    }

    private async findUniqueConnectionName(connectorName: string, connectionName: string, i: number): Promise<string> {
        let connectionId = `/connections/${connectionName}`;
        while (!await this.testConnectionIdUniqueness(connectionId)) {
            connectionName = `${connectorName}-${++i}`;
            connectionId = `/connections/${connectionName}`;
        }

        return connectionName;
    }

    private async testConnectionIdUniqueness(connectionId: string): Promise<boolean> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${connectionId}?api-version=${apiVersion}`;
        const response = await fetch(input);

        if (response.status === 200) {
            return false;
        } else if (response.status === 404) {
            return true;
        } else {
            throw new Error(`Unable to check if connection ID '${connectionId}' is unique`);
        }
    }
}

function addPrefix(value: string | undefined, prefix: string): string | undefined {
    return value !== undefined && !value.startsWith(prefix) ? `${prefix}${value}` : value;
}

function connectorHasCapability(capabilityToMatch: string): (managedApi: ManagedApi) => boolean {
    return (managedApi: ManagedApi): boolean => {
        const { capabilities } = managedApi.properties;
        if (capabilities === undefined) {
            return false;
        } else {
            return capabilities.some(capability => collator.compare(capability, capabilityToMatch) === 0);
        }
    };
}

function getManagedApiNameFromConnectorId(connectorId: string): string {
    return connectorId.indexOf("/") === -1 ? "" : connectorId.split("/").slice(-1)[0];
}

function getRequestBodyForCreateConnection(connectorId: string, properties?: ConnectionProperties): string {
    const displayName = properties !== undefined ? properties.displayName : undefined;
    const parameterValues = properties !== undefined ? properties.connectionParameters : undefined;
    const parameterValueSet = properties !== undefined ? properties.connectionParametersSet : undefined;
    return JSON.stringify({
        properties: {
            api: {
                id: connectorId
            },
            ...displayName !== undefined ? { displayName } : undefined,
            ...parameterValues !== undefined ? { parameterValues } : undefined,
            ...parameterValueSet !== undefined ? { parameterValueSet } : undefined
        }
    });
}

function normalizeConnection(connection: any): Connection {
    connection = {
        ...connection,
        id: addPrefix(connection.id, "/")
    };

    const properties = { ...connection.properties };
    const { api, testLinks } = properties;

    if (api !== undefined) {
        properties.apiId = api.id;
    }

    if (testLinks !== undefined) {
        interface TestLink {
            method: string;
            requestUri: string;
        }
        properties.testLinks = testLinks.map(({ method, requestUri }: TestLink) => ({ method, requestUri }));
    }

    properties.apiId = addPrefix(properties.apiId, "/");
    properties.connectionParameters = {
        ...properties.connectionParameters,
        ...properties.nonSecretParameterValues
    };

    return {
        ...connection,
        properties
    };
}

function normalizeConnector(connector: any): ManagedApi {
    const { generalInformation } = connector.properties;
    if (generalInformation === undefined) {
        return connector;
    }

    const { id } = generalInformation;
    return {
        ...connector,
        properties: {
            ...connector.properties,
            ...id !== undefined ? { id: addPrefix(id, "/") } : undefined,
            ...generalInformation
        }
    };
}
