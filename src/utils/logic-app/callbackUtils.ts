/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { WorkflowTriggerCallbackUrl, WorkflowTriggerListCallbackUrlQueries } from "azure-arm-logic/lib/models";

export type Callbacks = Record<string, ICallback>;

export interface ICallback {
    method: string;
    urlTemplate: string;
}

export interface ICallbackUrlAndTriggerName {
    callbackUrl: WorkflowTriggerCallbackUrl;
    triggerName: string;
}

interface ITriggerDefinition {
    type: string;
}

interface IWorkflowDefinitionWithTriggers {
    triggers?: Record<string, ITriggerDefinition>;
}

type HasCallbackFunction = (triggerName: string) => boolean;

export async function getCallbacks(client: LogicAppsManagementClient, definition: any, resourceGroupName: string, workflowName: string): Promise<Callbacks> {
    const triggers = await client.workflowTriggers.list(resourceGroupName, workflowName);
    const hasCallbackFn = hasCallback(definition);
    const triggersWithCallbacks = triggers.filter((trigger) => hasCallbackFn(trigger.name!));
    const callbackUrls: ICallbackUrlAndTriggerName[] = await Promise.all(
        triggersWithCallbacks.map(async (trigger) => {
            const triggerName = trigger.name!;
            const callbackUrl = await client.workflowTriggers.listCallbackUrl(resourceGroupName, workflowName, triggerName);

            return {
                callbackUrl,
                triggerName
            };
        }));

    return callbackUrls.reduce(
        (callbacks: Callbacks, current: ICallbackUrlAndTriggerName) => {
            const { callbackUrl, triggerName } = current;

            return {
                ...callbacks,
                [triggerName]: getCallback(callbackUrl)
            };
        },
        {});
}

function getCallback(callbackUrl: WorkflowTriggerCallbackUrl): ICallback {
    const { relativePath } = callbackUrl;

    if (relativePath === undefined) {
        const { method, value: urlTemplate } = callbackUrl;

        return {
            method: method!,
            urlTemplate: urlTemplate!
        };
    } else {
        const { basePath, method, queries } = callbackUrl;
        const normalizedRelativePath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
        const queryString = getQueryString(queries);
        const urlTemplate = queryString === undefined
            ? `${basePath!}/${normalizedRelativePath}`
            : `${basePath!}/${normalizedRelativePath}?${queryString}`;

        return {
            method: method!,
            urlTemplate
        };
    }
}

function getQueryString(queries: WorkflowTriggerListCallbackUrlQueries | undefined): string | undefined {
    if (queries === undefined) {
        return undefined;
    } else {
        const queryMap = queries as Record<string, string>;

        return Object.keys(queryMap).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryMap[key])}`).join("&");
    }
}

function hasCallback(definition: IWorkflowDefinitionWithTriggers): HasCallbackFunction {
    if (definition === undefined || definition.triggers === undefined) {
        return () => false;
    } else {
        const { triggers } = definition;

        return (triggerName) => {
            return Object.keys(triggers).filter((key) => triggerName === key).some((key) => {
                const { type } = triggers[key];
                return /Manual/i.test(type) || /Request/i.test(type);
            });
        };
    }
}
