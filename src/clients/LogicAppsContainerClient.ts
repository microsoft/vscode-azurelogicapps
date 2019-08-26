/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as request from "request-promise-native";
import * as vscode from "vscode";
import { Container, ContainerClient } from "./ContainerClient";

export interface ILogicAppsContainerClient {
    createOrUpdateConnection(containerId: string, connectionId: string, connection: Connection): Promise<Connection>;
    createOrUpdateContainer(containerId: string, container: Container): Promise<Container>;
    createOrUpdateLogicApp(containerId: string, logicAppId: string, logicApp: LogicApp): Promise<LogicApp>;
    deleteConnection(containerId: string, connectionId: string): Promise<void>;
    deleteContainer(containerId: string): Promise<void>;
    deleteLogicApp(containerId: string, logicAppId: string): Promise<void>;
    deleteRun(containerId: string, runId: string): Promise<void>;
    disableLogicApp(containerId: string, logicAppId: string): Promise<void>;
    enableLogicApp(containerId: string, logicAppId: string): Promise<void>;
    getConnection(containerId: string, connectionId: string): Promise<Connection>;
    getConnectionsByContainer(containerId: string): Promise<Results<Connection>>;
    getContainer(containerId: string): Promise<Container>;
    getContainers(): Promise<Results<Container>>;
    getLogicApp(containerId: string, logicAppId: string): Promise<LogicApp>;
    getLogicAppsByContainer(containerId: string): Promise<Results<LogicApp>>;
    getRun(containerId: string, runId: string): Promise<Run>;
    getRunsByLogicApp(containerId: string, logicAppId: string): Promise<Results<Run>>;
    getRunAction(containerId: string, runActionId: string): Promise<RunAction>;
    getRunActionsByRun(containerId: string, runId: string): Promise<Results<RunAction>>;
    getTrigger(containerId: string, triggerId: string): Promise<Trigger>;
    getTriggersByLogicApp(containerId: string, logicAppId: string): Promise<Results<Trigger>>;
    getVersion(containerId: string, versionId: string): Promise<Version>;
    getVersionsByLogicApp(containerId: string, logicAppId: string): Promise<Results<Version>>;
    listCallbackUrl(containerId: string, triggerId: string): Promise<CallbackUrl>;
    promoteVersion(containerId: string, logicAppId: string, versionId: string): Promise<void>;
    resubmitRun(containerId: string, logicAppId: string, runId: string): Promise<void>;
}

export interface ILogicAppsContainerClientOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CallbackUrl {
}

export interface Connection {
    id: string;
    name: string;
    properties: ConnectionProperties;
    type: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConnectionProperties {
}

export interface LogicApp {
    id: string;
    name: string;
    properties: LogicAppProperties;
    type: string;
}

export interface LogicAppProperties {
    definition: any;
    parameters: any;
    version?: string;
}

export interface Results<T> {
    nextLink?: string;
    value: T[];
}

export interface Run {
    id: string;
    name: string;
    properties: RunProperties;
    type: string;
}

export interface RunAction {
    id: string;
    name: string;
    properties: RunActionProperties;
    type: string;
}

export interface RunActionProperties {
    status: string;
}

export interface RunProperties {
    status: string;
    trigger: {
        name: string;
    };
    workflow: {
        id: string;
    };
}

export interface Trigger {
    id: string;
    name: string;
    properties: TriggerProperties;
    type: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TriggerProperties {
}

export interface Version {
    id: string;
    name: string;
    properties: VersionProperties;
    type: string;
}

export interface VersionProperties {
    definition: any;
    parameters: any;
}

export class LogicAppsContainerClient implements ILogicAppsContainerClient {
    protected containerClient: ContainerClient;

    public constructor(context: vscode.ExtensionContext, private readonly options: ILogicAppsContainerClientOptions) {
        this.containerClient = new ContainerClient(context);
    }

    public async createOrUpdateConnection(containerId: string, connectionId: string, connection: Connection): Promise<Connection> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${connectionId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            body: connection,
            json: true,
            method: "PUT"
        };
        const updatedConnection: Connection = await request(uri, options);
        return updatedConnection;
    }

    public async createOrUpdateContainer(containerId: string, container: Container): Promise<Container> {
        return this.containerClient.createOrUpdateContainer(containerId, container);
    }

    public async createOrUpdateLogicApp(containerId: string, logicAppId: string, logicApp: LogicApp): Promise<LogicApp> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            body: logicApp,
            json: true,
            method: "PUT"
        };
        const updatedLogicApp: LogicApp = await request(uri, options);
        return updatedLogicApp;
    }

    public async deleteConnection(containerId: string, connectionId: string): Promise<void> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${connectionId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            method: "DELETE"
        };
        await request(uri, options);
    }

    public async deleteContainer(containerId: string): Promise<void> {
        this.containerClient.deleteContainer(containerId);
    }

    public async deleteLogicApp(containerId: string, logicAppId: string): Promise<void> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            method: "DELETE"
        };
        await request(uri, options);
    }

    public async deleteRun(containerId: string, runId: string): Promise<void> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${runId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            method: "DELETE"
        };
        await request(uri, options);
    }

    public async disableLogicApp(containerId: string, logicAppId: string): Promise<void> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}/disable?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            method: "POST"
        };
        await request(uri, options);
    }

    public async enableLogicApp(containerId: string, logicAppId: string): Promise<void> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}/enable?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            method: "POST"
        };
        await request(uri, options);
    }

    public async getConnection(containerId: string, connectionId: string): Promise<Connection> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${connectionId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const connection: Connection = await request(uri, options);
        return connection;
    }

    public async getConnectionsByContainer(containerId: string): Promise<Results<Connection>> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management/connections?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const connections: Results<Connection> = await request(uri, options);
        return connections;
    }

    public async getContainer(containerId: string): Promise<Container> {
        return this.containerClient.getContainer(containerId)!;
    }

    public async getContainers(): Promise<Results<Container>> {
        return {
            value: this.containerClient.getContainers()
        };
    }

    public async getLogicApp(containerId: string, logicAppId: string): Promise<LogicApp> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const logicApp: LogicApp = await request(uri, options);
        return logicApp;
    }

    public async getLogicAppsByContainer(containerId: string): Promise<Results<LogicApp>> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management/workflows?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const logicApps: Results<LogicApp> = await request(uri, options);
        return logicApps;
    }

    public async getRun(containerId: string, runId: string): Promise<Run> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${runId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const run: Run = await request(uri, options);
        return run;
    }

    public async getRunAction(containerId: string, runActionId: string): Promise<RunAction> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${runActionId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const runAction: RunAction = await request(uri, options);
        return runAction;
    }

    public async getRunActionsByRun(containerId: string, runId: string): Promise<Results<RunAction>> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${runId}/actions?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const runActions: Results<RunAction> = await request(uri, options);
        return runActions;
    }

    public async getRunsByLogicApp(containerId: string, logicAppId: string): Promise<Results<Run>> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}/runs?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const runs: Results<Run> = await request(uri, options);
        return runs;
    }

    public async getTrigger(containerId: string, triggerId: string): Promise<Trigger> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${triggerId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const trigger: Trigger = await request(uri, options);
        return trigger;
    }

    public async getTriggersByLogicApp(containerId: string, logicAppId: string): Promise<Results<Trigger>> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}/triggers?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const triggers: Results<Trigger> = await request(uri, options);
        return triggers;
    }

    public async getVersion(containerId: string, versionId: string): Promise<Version> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${versionId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const version: Version = await request(uri, options);
        return version;
    }

    public async getVersionsByLogicApp(containerId: string, logicAppId: string): Promise<Results<Version>> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}/versions?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "GET"
        };
        const versions: Results<Version> = await request(uri, options);
        return versions;
    }

    public async listCallbackUrl(containerId: string, triggerId: string): Promise<CallbackUrl> {
        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${triggerId}/listCallbackUrl?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "POST"
        };
        const callbackUrl: CallbackUrl = await request(uri, options);
        return callbackUrl;
    }

    public async promoteVersion(containerId: string, logicAppId: string, versionId: string): Promise<void> {
        const [logicApp, version] = await Promise.all([
            this.getLogicApp(containerId, logicAppId),
            this.getVersion(containerId, versionId)
        ]);

        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${logicAppId}?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            body: {
                ...logicApp,
                properties: {
                    ...logicApp.properties,
                    definition: version.properties.definition,
                    parameters: version.properties.parameters
                }
            },
            json: true,
            method: "PUT"
        };
        await request(uri, options);
    }

    public async resubmitRun(containerId: string, logicAppId: string, runId: string): Promise<void> {
        const run = await this.getRun(containerId, runId);
        const { name: runName } = run;
        const { name: triggerName } = run.properties.trigger;
        const triggerHistoryId = `${logicAppId}/triggers/${triggerName}/histories/${runName}`;

        const container = await this.getContainer(containerId);
        const uri = `${container.properties.baseUrl}/api/management${triggerHistoryId}/resubmit?api-version=${this.options.apiVersion}`;
        const options: request.RequestPromiseOptions = {
            json: true,
            method: "POST"
        };
        await request(uri, options);
    }
}
