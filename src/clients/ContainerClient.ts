/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";

export interface Container {
    id: string;
    name: string;
    properties: ContainerProperties;
    type: string;
}

export interface ContainerProperties {
    baseUrl: string;
}

export type Containers = Record<string, Container>;

export class ContainerClient {
    public constructor(protected context: vscode.ExtensionContext) {
    }

    public createOrUpdateContainer(containerId: string, container: Container): Container {
        const containers = {
            ...this.context.globalState.get("containers") as Containers
        };

        const updatedContainer = {
            ...containers[containerId],
            id: containerId,
            name: containerId,
            properties: container.properties,
            type: container.type
        };

        containers[containerId] = updatedContainer;

        this.context.globalState.update("containers", containers);

        return updatedContainer;
    }

    public deleteContainer(containerId: string): void {
        const containers = {
            ...this.context.globalState.get("containers") as Containers
        };

        delete containers[containerId];

        this.context.globalState.update("containers", containers);
    }

    public getContainer(containerId: string): Container | undefined {
        const containers = {
            ...this.context.globalState.get("containers") as Containers
        };

        return containers[containerId];
    }

    public getContainers(): Container[] {
        const containers = {
            ...this.context.globalState.get("containers") as Containers
        };

        return Object.keys(containers).map(key => containers[key]);
    }
}
