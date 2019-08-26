/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ManagedApi, ManagedApiOperation } from "../ConnectionService";
import { IRecommendationProvider, IRecommendationProviderOptions, RecommendationConnector, RecommendationOperation, RecommendationResults } from "../RecommendationService";
import { BaseProvider, compareByRecommendationConnector, compareByRecommendationOperation, OperationKind } from "./BaseProvider";

interface StandardConnectorProviderOptions extends IRecommendationProviderOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;
}

export class StandardConnectorProvider extends BaseProvider<StandardConnectorProviderOptions> implements IRecommendationProvider {
    public constructor(options: StandardConnectorProviderOptions) {
        super(options);
    }

    public getConnectorBrandColor(managedApi: ManagedApi): string {
        return managedApi.properties.metadata.brandColor;
    }

    public getConnectorIcon(managedApi: ManagedApi): string {
        return managedApi.properties.generalInformation.iconUrl;
    }

    public getConnectorTitle(managedApi: ManagedApi): string {
        return managedApi.properties.generalInformation.displayName;
    }

    public async getConnectors(filterText: string): Promise<RecommendationResults<RecommendationConnector>> {
        const { apiVersion, baseUrl } = this.options;
        const input = filterText === ""
            ? `${baseUrl}/api/management/managedApis?api-version=${apiVersion}&$filter=properties/category eq 'Standard'`
            : `${baseUrl}/api/management/managedApis?api-version=${apiVersion}&$filter=properties/category eq 'Standard'&$search=${makeSearch(filterText)}`;
        const response = await fetch(input);
        const { value: rawValue } = await response.json();
        const value = rawValue
            .map(mapToRecommendationConnector)
            .sort(compareByRecommendationConnector);

        return {
            rawValue,
            value
        };
    }

    public async getConnectorsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationConnector>> {
        const response = await fetch(continuationToken);
        const { value: rawValue } = await response.json();
        const value = rawValue
            .map(mapToRecommendationConnector)
            .sort(compareByRecommendationConnector);

        return {
            rawValue,
            value
        };
    }

    public async getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        const { apiVersion, baseUrl } = this.options;
        const filter = makeOperationsFilter(filterText, kind);
        const input = filterText === undefined
            ? `${baseUrl}/api/management/apiOperations?api-version=${apiVersion}&$filter=${filter}`
            : `${baseUrl}/api/management/apiOperations?api-version=${apiVersion}&$filter=${filter}&$search=${makeSearch(filterText)}`;
        const response = await fetch(input);
        const { value: rawValue } = await response.json();
        const value = rawValue
            .map(mapToRecommendationOperation)
            .sort(compareByRecommendationOperation);

        return {
            rawValue,
            value
        };
    }

    public async getOperationsByConnector(connectorId: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        const { apiVersion, baseUrl } = this.options;
        const filter = makeOperationsFilter(filterText, kind, /* includeTypeFilter */ false);
        const input = filterText === undefined
            ? `${baseUrl}/api/management${connectorId}/apiOperations?api-version=${apiVersion}&$filter=${filter}`
            : `${baseUrl}/api/management${connectorId}/apiOperations?api-version=${apiVersion}&$filter=${filter}&$search=${makeSearch(filterText)}`;
        const response = await fetch(input);
        const { value: rawValue } = await response.json();
        const value = rawValue
            .map(mapToRecommendationOperation)
            .sort(compareByRecommendationOperation);

        return {
            rawValue,
            value
        };
    }

    public async getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>> {
        const response = await fetch(continuationToken);
        const { value: rawValue } = await response.json();
        const value = rawValue
            .map(mapToRecommendationOperation)
            .sort(compareByRecommendationOperation);

        return {
            rawValue,
            value
        };
    }

    public shouldAllowTriggerSelectionAsAction(): boolean {
        return true;
    }
}

function makeOperationsFilter(filterText: string, kind: string, includeTypeFilter = true): string {
    const operator = kind === OperationKind.TRIGGERS ? "ne" : "eq";
    const filter = !includeTypeFilter
        ? `properties/category eq 'Standard' and properties/trigger ${operator} null`
        : `properties/category eq 'Standard' and properties/trigger ${operator} null and type eq 'managedApis/apiOperations'`;

    return filterText !== "" ? filter : `${filter} and properties/visibility eq 'Important'`;
}

function makeSearch(filterText: string): string {
    return filterText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function mapToRecommendationConnector(connector: ManagedApi): RecommendationConnector {
    const {
        id,
        properties: {
            generalInformation: {
                displayName: title,
                iconUrl: icon
            },
            metadata: {
                brandColor
            }
        }
    } = connector;

    return {
        brandColor,
        icon,
        id,
        title
    };
}

function mapToRecommendationOperation(operation: ManagedApiOperation): RecommendationOperation {
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
        description,
        icon,
        id,
        preview: annotation === undefined ? false : annotation.status === "Preview",
        subtitle,
        title
    };
}
