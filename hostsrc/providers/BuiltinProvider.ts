/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ApiOperation, Connector, IBuiltInTypeService } from "../BuiltInTypeService";
import { IRecommendationProvider, IRecommendationProviderOptions, RecommendationConnector, RecommendationOperation, RecommendationResults } from "../RecommendationService";
import { BaseProvider, compareByRecommendationConnector, compareByRecommendationOperation, includes, OperationKind } from "./BaseProvider";

interface BuiltInProviderOptions extends IRecommendationProviderOptions {
    builtInTypeService: IBuiltInTypeService;
}

const collator = new Intl.Collator("en-US", { sensitivity: "base" });

export class BuiltInProvider extends BaseProvider<BuiltInProviderOptions> implements IRecommendationProvider {
    public constructor(options: BuiltInProviderOptions) {
        super(options);
    }

    public getConnectorBrandColor(connector: Connector): string {
        return connector.properties.brandColor;
    }

    public getConnectorIcon(connector: Connector): string {
        return connector.properties.iconUri;
    }

    public getConnectorTitle(connector: Connector): string {
        return connector.properties.displayName;
    }

    public async getConnectors(filterText: string): Promise<RecommendationResults<RecommendationConnector>> {
        const operations = this.getTriggersAndActions()
            .filter(operationMatchesFilterText(filterText))
            .map(mapToRecommendationOperation);
        const rawValue = this.options.builtInTypeService.getBuiltInConnectors()
            .filter(connectorHasDisplayName)
            .filter(connectorHasOperationsMatchingFilterText(operations));
        const value = rawValue
            .map(mapToRecommendationConnector)
            .sort(compareByRecommendationConnector);

        return {
            rawValue,
            value
        };
    }

    public async getConnectorsByContinuationToken(): Promise<RecommendationResults<RecommendationConnector>> {
        throw new Error("Not implemented");
    }

    public async getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        const rawValue = this.getOperationsByKind(kind)
            .filter(operationMatchesFilterText(filterText));
        const value = rawValue
            .map(mapToRecommendationOperation)
            .sort(compareByRecommendationOperation);

        return {
            rawValue,
            value
        };
    }

    public async getOperationsByConnector(connectorId: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        const rawValue = this.getOperationsByKind(kind)
            .filter(operationMatchesConnectorId(connectorId))
            .filter(operationMatchesFilterText(filterText));
        const value = rawValue
            .map(mapToRecommendationOperation)
            .sort(compareByRecommendationOperation);

        return {
            rawValue,
            value
        };
    }

    public async getOperationsByContinuationToken(): Promise<RecommendationResults<RecommendationOperation>> {
        throw new Error("Not implemented");
    }

    public selectOperation(operation: string): string {
        switch (operation) {
            case "foreach":
            case "if":
            case "scope":
            case "switch":
            case "until":
                return "SELECT_SCOPE_OPERATION";

            default:
                return "DEFAULT";
        }
    }

    public shouldAllowTriggerSelectionAsAction(_connectorId: string, _operationId: string, kind: string): boolean {
        return kind === OperationKind.ACTIONS;
    }

    private getOperationsByKind(kind: string): ApiOperation[] {
        const { builtInTypeService } = this.options;
        return kind === OperationKind.TRIGGERS
            ? builtInTypeService.getBuiltInTriggers()
            : builtInTypeService.getBuiltInActions(/* recommendationVisibleOnly */ true);
    }

    private getTriggersAndActions(): ApiOperation[] {
        const { builtInTypeService } = this.options;
        return [
            ...builtInTypeService.getBuiltInTriggers(),
            ...builtInTypeService.getBuiltInActions(/* recommendationVisibleOnly */ true)
        ];
    }
}

function connectorHasDisplayName(connector: any): boolean {
    return connector.properties.displayName !== undefined;
}

function connectorHasOperationsMatchingFilterText(operationsMatchingFilterText: RecommendationOperation[]): (connector: any) => boolean {
    const connectorIds = new Set(operationsMatchingFilterText.map(operation => operation.connector));
    return (connector: any): boolean => {
        return connectorIds.has(connector.id);
    };
}

function mapToRecommendationConnector(connector: Connector): RecommendationConnector {
    const {
        id,
        properties: {
            brandColor,
            displayName: title,
            iconUri: icon
        }
    } = connector;

    return {
        brandColor,
        icon,
        id,
        title
    };
}

function mapToRecommendationOperation(operation: ApiOperation): RecommendationOperation {
    const {
        id,
        properties: {
            annotation,
            api: {
                brandColor,
                displayName: subtitle,
                iconUri: icon,
                id: connector
            },
            description,
            summary: title
        }
    } = operation;

    return {
        brandColor,
        connector,
        connectorKind: "B",
        description,
        icon,
        id,
        preview: annotation === undefined ? false : annotation.status === "Preview",
        subtitle,
        title
    };
}

function operationMatchesConnectorId(connectorId: string): (operation: ApiOperation) => boolean {
    return (operation: ApiOperation): boolean => {
        return collator.compare(operation.properties.api.id, connectorId) === 0;
    };
}

function operationMatchesFilterText(filterText: string): (operation: ApiOperation) => boolean {
    if (filterText === "") {
        return () => true;
    }

    return (operation: ApiOperation): boolean => {
        const {
            api: {
                displayName
            },
            description,
            summary
        } = operation.properties;

        return includes(displayName, filterText) || includes(summary, filterText) || includes(description, filterText);
    };
}
