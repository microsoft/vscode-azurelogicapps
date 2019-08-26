/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ManagedApi } from "./ConnectionService";
import { Run, RunAction } from "./RunService";
import { WorkflowVersion } from "./WorkflowService";

interface IRunInstanceService {
    getRunInstance(runId: string, includeWorkflow: boolean): Promise<RunInstance>;
}

interface IRunInstanceServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;
}

interface RunInstance {
    apis?: ManagedApi[];
    run: Run;
    runActions: RunAction[];
    workflowVersion?: WorkflowVersion;
}

const collator = new Intl.Collator("en-US", { sensitivity: "base" });

export class RunInstanceService implements IRunInstanceService {
    public constructor(private readonly options: IRunInstanceServiceOptions) {
    }

    public async getRunInstance(runId: string, includeWorkflow: boolean): Promise<RunInstance> {
        const { apiVersion, baseUrl } = this.options;
        const input = !includeWorkflow
            ? `${baseUrl}/api/management${runId}?api-version=${apiVersion}&$expand=properties/actions`
            : `${baseUrl}/api/management${runId}?api-version=${apiVersion}&$expand=properties/actions,properties/connectionParameters,properties/swagger,workflow/properties`;
        const response = await fetch(input);
        const run: Run = await response.json();
        const runInstance = mapToRunInstance(run, includeWorkflow);
        return runInstance;
    }
}

function mapToManagedApis(connectionParameters: Record<string, any>): ManagedApi[] {
    const managedApis: ManagedApi[] = [];

    for (const key of Object.keys(connectionParameters)) {
        const { api } = connectionParameters[key];
        if (api == undefined) {
            continue;
        }

        const { name, properties } = api;
        if (properties === undefined) {
            continue;
        }

        if (managedApis.some(managedApi => collator.compare(managedApi.name, name) === 0)) {
            continue;
        }

        managedApis.push(api);
    }

    return managedApis;
}

function mapToRunInstance(run: Run, includeWorkflow: boolean): RunInstance {
    const actions = run.properties.actions || {};
    const runActions = Object.keys(actions).map(key => ({
        id: `${run.id}/actions/${key}`,
        name: key,
        properties: actions[key],
        type: "workflows/runs/actions"
    } as RunAction));

    let apis: ManagedApi[] | undefined;
    let workflowVersion: WorkflowVersion | undefined;
    if (includeWorkflow) {
        workflowVersion = run.properties.workflow;
        if (workflowVersion !== undefined && workflowVersion.properties.connectionParameters !== undefined) {
            apis = mapToManagedApis(workflowVersion.properties.connectionParameters);
        }
    }

    return {
        apis,
        run,
        runActions,
        workflowVersion
    };
}
