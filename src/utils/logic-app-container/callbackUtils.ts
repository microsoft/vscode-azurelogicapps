/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkflowTriggerCallbackUrl, WorkflowTriggerListCallbackUrlQueries } from "azure-arm-logic/lib/models";
import * as request from "request-promise-native";
import { ILogicAppsContainerClient, Trigger } from "../../clients/LogicAppsContainerClient";
import { Callbacks, ICallback, ICallbackUrlAndTriggerName } from "../logic-app/callbackUtils";

type HasCallbackFunction = (triggerName: string) => boolean;

export async function getCallbacks(client: ILogicAppsContainerClient, containerId: string, definition: any, logicAppId: string, triggers: Trigger[]): Promise<Callbacks> {
    const hasCallbackFn = hasCallback(definition);
    const triggersWithCallbacks = triggers.filter((trigger) => hasCallbackFn(trigger.name!));
    const callbackUrls = await Promise.all(
        triggersWithCallbacks.map(async (trigger) => {
            const triggerName = trigger.name!;
            const triggerId = `${logicAppId}/triggers/${triggerName}`;
            const callbackUrl = await client.listCallbackUrl(containerId, triggerId);

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

export async function runTrigger(client: ILogicAppsContainerClient, containerId: string, triggerId: string): Promise<void> {
    const callbackUrl = await client.listCallbackUrl(containerId, triggerId);
    const { method, urlTemplate } = getCallback(callbackUrl);
    const options: request.RequestPromiseOptions = {
        json: true,
        method
    };
    return request(urlTemplate, options);
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

function hasCallback(definition: any): HasCallbackFunction {
    if (definition === undefined || definition.triggers === undefined) {
        return () => false;
    } else {
        const { triggers } = definition;

        return (triggerName) => {
            return Object.keys(triggers).filter((key) => triggerName === key).some((key) => {
                const { type } = triggers[key];
                return /Request/i.test(type);
            });
        };
    }
}
