/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AnalyticsService } from "./AnalyticsService";

export interface IBuiltInTypeService {
    getBuiltInActions(recommendationVisibleOnly?: boolean): ApiOperation[];
    getBuiltInConnectors(): Connector[];
    getBuiltInOperationIds(): Partial<BuiltInOperationIdsTypes>;
    getBuiltInOutputs(): Record<string, Record<string, Outputs>>;
    getBuiltInOutputsForOperation(connectorId: string, operationId: string): Record<string, Outputs>;
    getBuiltInParameters(): Record<string, BuiltInParameterDefinition>;
    getBuiltInParametersKey(): any;
    getBuiltInTriggers(): ApiOperation[];
    getEnvironmentBadge?(connectorId: string, operationId: string): Badge | undefined;
    getOperationKind(connectorId: string, oepration: ConnectionOperation): string | undefined;
    getOperationType(connectorId: string, operation: ConnectionOperation, isWebhookOperation: boolean, analytics: AnalyticsService): string;
    isBuiltIn(connectorId: string, connectionOperation: string): boolean;
}

interface IBuiltInTypeServiceOptions {
    builtInTypeService: IBuiltInTypeService;
}

export interface ApiOperation {
    id: string;
    properties: ApiOperationProperties;
}

interface ApiOperationProperties {
    annotation?: {
        status: string;
    };
    api: {
        brandColor: string;
        displayName: string;
        iconUri: string;
        id: string;
    };
    description: string;
    summary: string;
}

interface Badge {
}

interface BuiltInOperationIdsTypes {
}

interface BuiltInParameterDefinition {
}

interface ConnectionOperation {
    properties: ConnectionOperationProperties;
    type: string;
}

interface ConnectionOperationProperties {
    api?: any;
    operationKind?: string;
    operationType?: string;
}

export interface Connector {
    id: string;
    name: string;
    properties: ConnectorProperties;
    type: "bulitin";
}

interface ConnectorProperties {
    brandColor: string;
    displayName: string;
    iconUri: string;
}

interface Outputs {
}

const supportedApiOperationIds = [
    "add_to_time",
    "append_to_array_variable",
    "append_to_string_variable",
    "compose",
    "convert_time_zone",
    "current_time",
    "decrementvariable",
    "delay_until",
    "delay",
    "foreach",
    "get_future_time",
    "get_past_time",
    "http_with_swagger",
    "http",
    "httpwebhook",
    "if",
    "increment_variable",
    "initializevariable",
    "join",
    "parsejson",
    "query",
    "recurrence",
    "request",
    "response",
    "scope",
    "select",
    "setvariable",
    "slidingwindow",
    "subtract_from_time",
    "switch",
    "table_csv",
    "table_html",
    "terminate",
    "until"
];

const supportedConnectorIds = [
    "connectionProviders/control",
    "connectionProviders/dataOperation",
    "connectionProviders/datetime",
    "connectionProviders/function",
    "connectionProviders/http",
    "connectionProviders/request",
    "connectionProviders/schedule",
    "connectionProviders/variable"
];

export class BuiltInTypeService implements IBuiltInTypeService {
    private builtInActions: ApiOperation[] | undefined;
    private builtInActionsRecommendationVisibleOnly: ApiOperation[] | undefined;
    private builtInConnectors: Connector[] | undefined;
    private builtInOperationIds: BuiltInOperationIdsTypes | undefined;
    private builtInOutputs: Record<string, Record<string, Outputs>> | undefined;
    private builtInParameters: Record<string, BuiltInParameterDefinition> | undefined;
    private builtInParametersKey: any;
    private builtInTriggers: ApiOperation[] | undefined;

    public constructor(_: string, private readonly options: IBuiltInTypeServiceOptions) {
    }

    public getBuiltInActions(recommendationVisibleOnly?: boolean): ApiOperation[] {
        if (recommendationVisibleOnly) {
            if (this.builtInActionsRecommendationVisibleOnly === undefined) {
                const builtInActions = this.options.builtInTypeService.getBuiltInActions(recommendationVisibleOnly);
                this.builtInActionsRecommendationVisibleOnly = builtInActions.filter(isSupportedApiOperation);
            }

            return this.builtInActionsRecommendationVisibleOnly;
        } else {
            if (this.builtInActions === undefined) {
                const builtInActions = this.options.builtInTypeService.getBuiltInActions(recommendationVisibleOnly);
                this.builtInActions = builtInActions.filter(isSupportedApiOperation);
            }

            return this.builtInActions;
        }
    }

    public getBuiltInConnectors(): Connector[] {
        if (this.builtInConnectors === undefined) {
            const builtInConnectors = this.options.builtInTypeService.getBuiltInConnectors();
            this.builtInConnectors = builtInConnectors.filter(isSupportedConnector);
        }

        return this.builtInConnectors;
    }

    // NOTE(joechung): This service only removes unsupported operations so using the existing built-in type service should be fine.
    public getBuiltInOperationIds(): Partial<BuiltInOperationIdsTypes> {
        if (this.builtInOperationIds === undefined) {
            const builtInOperationIds: Record<string, string> = this.options.builtInTypeService.getBuiltInOperationIds();
            this.builtInOperationIds = builtInOperationIds;
        }

        return this.builtInOperationIds;
    }

    // NOTE(joechung): This service only removes unsupported operations so using the existing built-in type service should be fine.
    public getBuiltInOutputs(): Record<string, Record<string, Outputs>> {
        if (this.builtInOutputs === undefined) {
            const builtInOutputs = this.options.builtInTypeService.getBuiltInOutputs();
            this.builtInOutputs = builtInOutputs;
        }

        return this.builtInOutputs;
    }

    // NOTE(joechung): This service only removes unsupported operations so using the existing built-in type service should be fine.
    public getBuiltInOutputsForOperation(connectorId: string, operationId: string): Record<string, Outputs> {
        return this.options.builtInTypeService.getBuiltInOutputsForOperation(connectorId, operationId);
    }

    // NOTE(joechung): This service only removes unsupported operations so using the existing built-in type service should be fine.
    public getBuiltInParameters(): Record<string, BuiltInParameterDefinition> {
        if (this.builtInParameters === undefined) {
            this.builtInParameters = this.options.builtInTypeService.getBuiltInParameters();
        }

        return this.builtInParameters;
    }

    // NOTE(joechung): This service only removes unsupported operations so using the existing built-in type service should be fine.
    public getBuiltInParametersKey(): any {
        if (this.builtInParametersKey === undefined) {
            this.builtInParametersKey = this.options.builtInTypeService.getBuiltInParametersKey();
        }

        return this.builtInParametersKey;
    }

    public getBuiltInTriggers(): ApiOperation[] {
        if (this.builtInTriggers === undefined) {
            const builtInTriggers = this.options.builtInTypeService.getBuiltInTriggers();
            this.builtInTriggers = builtInTriggers.filter(isSupportedApiOperation);
        }

        return this.builtInTriggers;
    }

    public getOperationKind(_: string, operation: ConnectionOperation): string | undefined {
        const { type } = operation;
        switch (type) {
            case "managedApis/apiOperations":
                return operation.properties.operationKind;

            default:
                if (operation.properties.api !== undefined) {
                    return operation.properties.operationKind;
                } else {
                    throw new Error(`Unexpected operation type '${type}'`);
                }
        }
    }

    public getOperationType(_: string, operation: ConnectionOperation, isWebhookOperation: boolean): string {
        const { type } = operation;
        switch (type) {
            case "managedApis/apiOperations":
                return isWebhookOperation ? "ApiConnectionWebhook" : "ApiConnection";

            default:
                if (operation.properties.api !== undefined) {
                    return operation.properties.operationType!;
                } else {
                    throw new Error(`Unexpected operation type '${type}'`);
                }
        }
    }

    // NOTE(joechung): This service only removes unsupported operations so using the existing built-in type service should be fine.
    public isBuiltIn(connectorId: string, connectionOperation: string): boolean {
        return this.options.builtInTypeService.isBuiltIn(connectorId, connectionOperation);
    }
}

function isSupportedApiOperation(operation: ApiOperation): boolean {
    return supportedApiOperationIds.some(supportdApiOperationId => supportdApiOperationId === operation.id);
}

function isSupportedConnector(connector: Connector): boolean {
    return supportedConnectorIds.some(supportedConnectorId => supportedConnectorId === connector.id);
}
