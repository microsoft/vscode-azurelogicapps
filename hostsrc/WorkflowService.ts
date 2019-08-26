/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface IWorkflowService {
    getWorkflow(workflowId: string): Promise<Workflow>;
    getWorkflowVersion(workflowVersionId: string): Promise<WorkflowVersion>;
    listSwagger(workflowId: string): Promise<any>;
}

interface IWorkflowServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;
}

interface Workflow {
    id: string;
    name: string;
    properties: WorkflowProperties;
    type: "workflows";
}

interface WorkflowProperties {
}

export interface WorkflowVersion {
    id: string;
    name: string;
    properties: WorkflowVersionProperties;
    type: "workflows/versions";
}

interface WorkflowVersionProperties {
    connectionParameters?: Record<string, any>;
}

export class WorkflowService implements IWorkflowService {
    public constructor(private readonly options: IWorkflowServiceOptions) {
    }

    public async getWorkflow(workflowId: string): Promise<Workflow> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${workflowId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const workflow: Workflow = await response.json();
        return workflow;
    }

    public async getWorkflowVersion(workflowVersionId: string): Promise<WorkflowVersion> {
        const { apiVersion, baseUrl } = this.options;
        const input = `${baseUrl}/api/management${workflowVersionId}?api-version=${apiVersion}`;
        const response = await fetch(input);
        const workflowVersion: WorkflowVersion = await response.json();
        return workflowVersion;
    }

    // NOTE(joechung): Child workflows are not supported in Logic App containers.
    public async listSwagger(): Promise<any> {
        throw new Error("Not implemented");
    }
}
