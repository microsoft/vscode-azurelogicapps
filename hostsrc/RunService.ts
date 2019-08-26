/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkflowVersion } from "./WorkflowService";

interface IRunService {
    getActionInputs(action: RunAction): Promise<any>;
    getActionOutputs(action: RunAction): Promise<any>;
    getActions(runId: string): Promise<RunActions>;
    getContent(contentLink: Link | undefined): Promise<any>;
    getRepetition(repetitionId: string): Promise<RunRepetition>;
    getRepetitionInputsOutputs(repetition: RunRepetition): Promise<RunRepetition>;
    getRepetitions(action: RunAction, count?: number): Promise<RunRepetition[]>;
    getRequestHistories(actionId: string): Promise<RunRequestHistory[]>;
    getRequestHistoriesForRepetition(actionId: string, repetitionName: string): Promise<RunRequestHistory[]>;
    getRun(runId: string): Promise<Run>;
    getScopeRepetitions(action: RunAction, status?: string): Promise<RunScopeRepetition[]>;
    getTrigger(triggerId: string): Promise<RunTrigger>;
    getTriggerHistory(triggerHistoryId: string): Promise<RunTriggerHistory>;
    getTriggerHistoryInputs(triggerHistory: RunTriggerHistory): Promise<any>;
    getTriggerHistoryOutputs(triggerHistory: RunTriggerHistory): Promise<any>;
    getTriggers(workflowId: string): Promise<RunTriggers>;
    listExpressionTraces(actionId: string): Promise<TraceRecord>;
    listExpressionTracesForRepetition(repetitionId: string): Promise<TraceRecord>;
}

interface IRunServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;
}

interface Link {
    contentSize: number;
    uri?: string;
}

export interface Run {
    id: string;
    name: string;
    properties: RunProperties;
    type: "workflows/runs";
}

export interface RunAction {
    id: string;
    name: string;
    properties: RunActionProperties;
    type: "workflows/runs/actions";
}

interface RunActionProperties {
    inputs?: any;
    inputsLink?: Link;
    outputs: any;
    outputsLink?: Link;
}

interface RunActions {
    actions: RunAction[];
    nextLink?: string;
}

interface RunProperties {
    actions?: Record<string, RunActionProperties>;
    workflow?: WorkflowVersion;
}

interface RunRepetition {
    id: string;
    name: string;
    properties: RunRepetitionProperties;
    type: "workflows/runs/actions/repetitions";
}

interface RunRepetitionProperties {
    inputs?: any;
    inputsLink?: Link;
    outputs?: any;
    outputsLink?: Link;
}

interface RunRequestHistory {
    id: string;
    name: string;
    properties: RunRequestHistoryProperties;
    type: "workflows/runs/actions/requestHistories";
}

interface RunRequestHistoryProperties {
}

interface RunScopeRepetition {
    id: string;
    name: string;
    properties: RunScopeRepetitionProperties;
    type: "workflows/runs/actions/scopeRepetitions";
}

interface RunScopeRepetitionProperties {
}

interface RunTrigger {
    id: string;
    name: string;
    properties: RunTriggerProperties;
    type: "workflows/triggers";
}

interface RunTriggerHistory {
    id: string;
    name: string;
    properties: RunTriggerHistoryProperties;
    type: "workflows/triggers/histories";
}

interface RunTriggerHistoryProperties {
    inputs?: any;
    inputsLink?: Link;
    outputs?: any;
    outputsLink?: Link;
}

interface RunTriggerProperties {
}

interface RunTriggers {
    nextLink?: string;
    triggers: RunTrigger[];
}

interface TraceRecord {
}

const CONTENT_SIZE_MAX = 262144; // 2**18

export class RunService implements IRunService {
    public constructor(private readonly options: IRunServiceOptions) {
    }

    public async getActionInputs(action: RunAction): Promise<any> {
        const { inputsLink } = action.properties;
        if (inputsLink === undefined) {
            return undefined;
        }

        return this.getContent(inputsLink);
    }

    public async getActionOutputs(action: RunAction): Promise<any> {
        const { outputsLink } = action.properties;
        if (outputsLink === undefined) {
            return undefined;
        }

        return this.getContent(outputsLink);
    }

    public async getActions(runId: string): Promise<RunActions> {
        interface ActionsResponse {
            nextLink?: string;
            value: RunAction[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${runId}/actions?api-version=${apiVersion}`;
        const response = await fetch(input);
        const { nextLink, value: actions }: ActionsResponse = await response.json();
        return {
            actions,
            nextLink
        };
    }

    public async getContent(contentLink: Link | undefined): Promise<any> {
        if (contentLink === undefined) {
            return undefined;
        }

        const { contentSize, uri } = contentLink;
        if (contentSize > CONTENT_SIZE_MAX || uri === undefined) {
            return undefined;
        }

        const response = await fetch(uri);
        if (response.status === 200) {
            return getContent(response);
        } else if (response.status === 204) {
            return undefined;
        } else {
            throw new TypeError("Failed to fetch");
        }
    }

    public async getRepetition(repetitionId: string): Promise<RunRepetition> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${repetitionId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const repetition: RunRepetition = await response.json();
        return repetition;
    }

    public async getRepetitionInputsOutputs(repetition: RunRepetition): Promise<RunRepetition> {
        const { properties } = repetition;
        const [inputs, outputs] = await Promise.all([
            this._getRepetitionInputs(properties),
            this._getRepetitionOutputs(properties)
        ]);
        return {
            ...repetition,
            properties: {
                ...repetition.properties,
                ...inputs !== undefined ? { inputs } : undefined,
                ...outputs !== undefined ? { outputs } : undefined
            }
        };
    }

    public async getRepetitions(action: RunAction, count?: number): Promise<RunRepetition[]> {
        interface RepetitionsResponse {
            value: RunRepetition[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = count === undefined
            ? `${baseUrl}/api/management${action.id}/repetitions?api-version=${apiVersion}`
            : `${baseUrl}/api/management${action.id}/repetitions?api-version=${apiVersion}&$top=${count}`;
        const response = await fetch(input);
        const { value }: RepetitionsResponse = await response.json();
        return value;
    }

    public async getRequestHistories(actionId: string): Promise<RunRequestHistory[]> {
        interface RequestHistoriesResponse {
            value: RunRequestHistory[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${actionId}/requestHistories/?api-version=${apiVersion}`;
        const response = await fetch(input);
        const { value }: RequestHistoriesResponse = await response.json();
        return value;
    }

    public async getRequestHistoriesForRepetition(actionId: string, repetitionName: string): Promise<RunRequestHistory[]> {
        interface RequestHistoriesResponse {
            value: RunRequestHistory[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${actionId}/repetitions/${repetitionName}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const { value }: RequestHistoriesResponse = await response.json();
        return value;
    }

    public async getRun(runId: string): Promise<Run> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${runId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const run: Run = await response.json();
        return run;
    }

    public async getScopeRepetitions(action: RunAction, status?: string): Promise<RunScopeRepetition[]> {
        interface ScopeRepetitionsResponse {
            value: RunScopeRepetition[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = status === undefined
            ? `${baseUrl}/api/management${action.id}/scopeRepetitions?api-version=${apiVersion}`
            : `${baseUrl}/api/management${action.id}/scopeRepetitions?api-version=${apiVersion}&$filter=status eq '${status}'`;
        const response = await fetch(input);
        const { value }: ScopeRepetitionsResponse = await response.json();
        return value;
    }

    public async getTrigger(triggerId: string): Promise<RunTrigger> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${triggerId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const runTrigger: RunTrigger = await response.json();
        return runTrigger;
    }

    public async getTriggerHistory(triggerHistoryId: string): Promise<RunTriggerHistory> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${triggerHistoryId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const runTriggerHistory: RunTriggerHistory = await response.json();
        return runTriggerHistory;
    }

    public async getTriggerHistoryInputs(triggerHistory: RunTriggerHistory): Promise<any> {
        const { inputsLink } = triggerHistory.properties;
        if (inputsLink === undefined) {
            return undefined;
        }

        return this.getContent(inputsLink);
    }

    public async getTriggerHistoryOutputs(triggerHistory: RunTriggerHistory): Promise<any> {
        const { outputsLink } = triggerHistory.properties;
        if (outputsLink === undefined) {
            return undefined;
        }

        return this.getContent(outputsLink);
    }

    public async getTriggers(workflowId: string): Promise<RunTriggers> {
        interface TriggersResponse {
            nextLink?: string;
            value: RunTrigger[];
        }
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${workflowId}/triggers?api-version=${apiVersion}`;
        const response = await fetch(input);
        const { nextLink, value: triggers }: TriggersResponse = await response.json();
        return {
            nextLink,
            triggers
        };
    }

    public async listExpressionTraces(actionId: string): Promise<TraceRecord> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${actionId}/listExpressionTraces?api-version=${apiVersion}`;
        const init: RequestInit = {
            method: "POST"
        };
        const response = await fetch(input, init);
        const traceRecord: TraceRecord = await response.json();
        return traceRecord;
    }

    public async listExpressionTracesForRepetition(repetitionId: string): Promise<TraceRecord> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${repetitionId}/listExpressionTraces?api-version=${apiVersion}`;
        const requestInit: RequestInit = {
            method: "POST"
        };
        const response = await fetch(input, requestInit);
        const traceRecord: TraceRecord = await response.json();
        return traceRecord;
    }

    private async _getRepetitionInputs(properties: RunRepetitionProperties): Promise<RunRepetitionProperties | undefined> {
        const { inputsLink } = properties;
        if (inputsLink === undefined) {
            return undefined;
        }

        return this.getContent(inputsLink);
    }

    private async _getRepetitionOutputs(properties: RunRepetitionProperties): Promise<RunRepetitionProperties | undefined> {
        const { outputsLink } = properties;
        if (outputsLink === undefined) {
            return undefined;
        }

        return this.getContent(outputsLink);
    }
}

async function getContent(response: Response): Promise<any> {
    const contentType = response.headers.get("Content-Type")!;

    if (/^application\/.*\+?json/i.test(contentType)) {
        return response.json();
    } else if (/^text\//i.test(contentType)) {
        return response.text();
    } else if (/^multipart\//i.test(contentType)) {
        return `The '${contentType}' MIME type is not supported.`;
    } else {
        const blob = await response.blob();
        const dataUri = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error);
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });

        return {
            "$content-type": contentType || "application/octet-stream",
            $content: dataUri.slice(dataUri.indexOf(";base64,") + 8)
        };
    }
}
