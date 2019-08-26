/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBuiltInTypeService } from "../BuiltInTypeService";
import { IRecommendationProvider, IRecommendationProviderOptions, RecommendationConnector, RecommendationOperation, RecommendationResults } from "../RecommendationService";
import { BaseProvider, compareByRecommendationConnector, compareByRecommendationOperation } from "./BaseProvider";
import { BuiltInProvider } from "./BuiltinProvider";
import { StandardConnectorProvider } from "./StandardConnectorProvider";

interface AllProviderOptions extends IRecommendationProviderOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;

    builtInTypeService: IBuiltInTypeService;
}

export class AllProvider extends BaseProvider<AllProviderOptions> implements IRecommendationProvider {
    private readonly builtInProvider: BuiltInProvider;
    private readonly standardConnectorProvider: StandardConnectorProvider;

    public constructor(options: AllProviderOptions) {
        super(options);
        const { apiVersion, baseUrl, builtInTypeService } = options;
        this.builtInProvider = new BuiltInProvider({ builtInTypeService });
        this.standardConnectorProvider = new StandardConnectorProvider({ apiVersion, baseUrl });
    }

    public getConnectorBrandColor(connector: any): string {
        switch (connector.type) {
            case "builtIn":
                return this.builtInProvider.getConnectorBrandColor(connector);
            case "managedApis":
                return this.standardConnectorProvider.getConnectorBrandColor(connector);
            default:
                throw new Error("Not supported");
        }
    }

    public getConnectorIcon(connector: any): string {
        switch (connector.type) {
            case "builtIn":
                return this.builtInProvider.getConnectorIcon(connector);
            case "managedApis":
                return this.standardConnectorProvider.getConnectorIcon(connector);
            default:
                throw new Error("Not supported");
        }
    }

    public getConnectorTitle(connector: any): string {
        switch (connector.type) {
            case "builtIn":
                return this.builtInProvider.getConnectorTitle(connector);
            case "managedApis":
                return this.standardConnectorProvider.getConnectorTitle(connector);
            default:
                throw new Error("Not supported");
        }
    }

    public async getConnectors(filterText: string): Promise<RecommendationResults<RecommendationConnector>> {
        const [builtInConnectors, standardConnectors] = await Promise.all([
            this.builtInProvider.getConnectors(filterText),
            this.standardConnectorProvider.getConnectors(filterText)
        ]);
        const { rawValue: builtInRawValue, value: builtInValue } = builtInConnectors;
        const { rawValue: standardConnectorRawValue, value: standardConnectorValue } = standardConnectors;
        const rawValue = [
            ...builtInRawValue,
            ...standardConnectorRawValue
        ];
        const value = [
            ...builtInValue,
            ...standardConnectorValue
        ].sort(compareByRecommendationConnector);
        return {
            rawValue,
            value
        };
    }

    public async getConnectorsByContinuationToken(): Promise<RecommendationResults<RecommendationConnector>> {
        throw new Error("Not implemented");
    }

    public async getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        const [builtInOperations, standardOperations] = await Promise.all([
            this.builtInProvider.getOperations(filterText, kind),
            this.standardConnectorProvider.getOperations(filterText, kind)
        ]);
        const { rawValue: builtInRawValue, value: builtInValue } = builtInOperations;
        const { rawValue: standardConnectorRawValue, value: standardConnectorValue } = standardOperations;
        const rawValue = [
            ...builtInRawValue,
            ...standardConnectorRawValue
        ];
        const value = [
            ...builtInValue,
            ...standardConnectorValue
        ].sort(compareByRecommendationOperation);
        return {
            rawValue,
            value
        };
    }

    public async getOperationsByConnector(connectorId: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        return this.options.builtInTypeService.getBuiltInConnectors().some(connector => connector.id === connectorId)
            ? this.builtInProvider.getOperationsByConnector(connectorId, filterText, kind)
            : this.standardConnectorProvider.getOperationsByConnector(connectorId, filterText, kind);
    }

    public async getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>> {
        return this.standardConnectorProvider.getOperationsByContinuationToken(continuationToken);
    }

    public goBack(): string {
        return this.builtInProvider.goBack();
    }

    public selectConnector(connectorId: string, kind: string): string {
        return this.builtInProvider.selectConnector(connectorId, kind);
    }

    public selectOperation(operationId: string): string {
        return this.builtInProvider.selectOperation(operationId);
    }

    public shouldAllowTriggerSelectionAsAction(connectorId: string, operationId: string, kind: string): boolean {
        return this.options.builtInTypeService.isBuiltIn(connectorId, operationId)
            ? this.builtInProvider.shouldAllowTriggerSelectionAsAction(connectorId, operationId, kind)
            : this.standardConnectorProvider.shouldAllowTriggerSelectionAsAction();
    }
}
