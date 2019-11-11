/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServiceClientCredentials } from "ms-rest";
import * as request from "request-promise-native";
import { getAuthorization } from "../authorizationUtils";

export type ConnectionReferences = Record<string, IConnectionReference>;

export interface IConnectionReference {
    connectionId: string;
    connectionName: string;
    id: string;
}

interface IConnectionsParameter {
    value: ConnectionReferences;
}

interface IWorkflowWithConnectionReferences {
    properties: IWorkflowPropertiesWithConnectionReferences;
}

interface IWorkflowParametersWithConnectionReferences {
    $connections?: IConnectionsParameter;
}

interface IWorkflowPropertiesWithConnectionReferences {
    parameters?: IWorkflowParametersWithConnectionReferences;
}

export async function getConnectionReferencesForLogicApp(credentials: ServiceClientCredentials, subscriptionId: string, resourceGroupName: string, workflowName: string, apiVersion: string): Promise<ConnectionReferences> {
    return getConnectionReferences(credentials, `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Logic/workflows/${workflowName}?api-version=${apiVersion}`);
}

export async function getConnectionReferencesForLogicAppVersion(credentials: ServiceClientCredentials, subscriptionId: string, resourceGroupName: string, workflowName: string, workflowVersionName: string, apiVersion: string): Promise<ConnectionReferences> {
    return getConnectionReferences(credentials, `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Logic/workflows/${workflowName}/versions/${workflowVersionName}?api-version=${apiVersion}`);
}

async function getConnectionReferences(credentials: ServiceClientCredentials, uri: string): Promise<ConnectionReferences> {
    const authorization = await getAuthorization(credentials);
    const options: request.RequestPromiseOptions = {
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json"
        },
        method: "GET",
        qs: {
            $expand: "properties/connectionReferences"
        }
    };
    const response = await request(uri, options);
    const {
        properties: {
            parameters
        }
    }: IWorkflowWithConnectionReferences = JSON.parse(response);

    if (parameters === undefined) {
        return {};
    } else {
        const { $connections } = parameters;
        return $connections === undefined ? {} : $connections.value;
    }
}
