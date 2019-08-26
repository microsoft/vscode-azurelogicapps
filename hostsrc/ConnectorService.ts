/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface IConnectorService {
    execute(httpMethod: string, runtimeUrl: string, inputs: OperationInputs): Promise<any>;
}

interface IConnectorServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;
}

interface OperationInputs {
    body?: any;
    headers?: Record<string, string>;
    path: string;
    queries?: Record<string, string>;
}

export class ConnectorService implements IConnectorService {
    public constructor(private readonly options: IConnectorServiceOptions) {
    }

    public async execute(httpMethod: string, runtimeUrl: string, inputs: OperationInputs): Promise<any> {
        const { apiVersion } = this.options;
        const init: RequestInit = {
            body: JSON.stringify(inputs.body),
            headers: {
                "Content-Type": "application/json",
                ...inputs.headers
            },
            method: httpMethod
        };
        const queries: Record<string, string> = {
            ...inputs.queries,
            "api-version": apiVersion
        };
        const queryString = makeQueryString(queries);
        const input = `${combinePath(runtimeUrl, inputs.path)}${queryString}`;
        const response = await fetch(input, init);
        return response.json();
    }
}

function combinePath(baseUrl: string, path: string): string {
    return `${trimUrl(baseUrl)}/${trimUrl(path)}`;
}

function makeQueryString(queries: Record<string, string>): string {
    const parameters: string[] = [];
    for (const key of Object.keys(queries)) {
        const value = queries[key];
        parameters.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }

    return parameters.length === 0 ? "" : `?${parameters.join("&")}`;
}

function trimUrl(url: string): string {
    if (url[0] === "/") {
        url = url.slice(1);
    }

    if (url[url.length - 1] === "/") {
        url = url.slice(0, url.length - 1);
    }

    return url;
}
