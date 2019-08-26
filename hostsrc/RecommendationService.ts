/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBuiltInTypeService } from "./BuiltInTypeService";
import { AllProvider } from "./providers/AllProvider";
import { BuiltInProvider } from "./providers/BuiltinProvider";
import { StandardConnectorProvider } from "./providers/StandardConnectorProvider";

export interface IRecommendationProvider {
    getConnectorBrandColor(rawConnector: any): string;
    getConnectorIcon(rawConnector: any): string;
    getConnectorTitle(rawConnector: any): string;
    getConnectors(filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>>;
    getConnectorsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationConnector>>;
    getDefaultOperationKind(isTrigger: boolean): string;
    getExtraOperations(kind: string): RecommendationOperation[];
    getExtraOperationsByConnector?(connectorId: string, kind: string): Promise<RecommendationOperation[]>;
    getOperationKinds(): RecommendationOperationKind[];
    getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;
    getOperationsByConnector(connectorId: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;
    getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>>;
    getSearchBoxPlaceholder(kind: string): string;
    getUserVoiceProps(): RecommendationUserVoiceProps;
    goBack(): string;
    selectConnector(connectorId: string, kind: string): string;
    selectOperation(operationId: string, kind: string): string;
    shouldAllowTriggerSelectionAsAction?(connectorId: string, operationId: string, kind: string): boolean;
}

export interface IRecommendationProviderOptions {
}

interface IRecommendationService {
    canAddOperation?(rawOperation: any): Promise<boolean>;
    clearContext?(): void;
    getCategories(): RecommendationCategory[];
    getConnectorBrandColor(category: string, rawConnector: any): string;
    getConnectorIcon(category: string, rawConnector: any): string;
    getConnectorTitle(category: string, rawConnector: any): string;
    getConnectorsByCategory(category: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>>;
    getConnectorsByContinuationToken(category: string, continuationToken: string): Promise<RecommendationResults<RecommendationConnector>>;
    getDefaultCategoryKey(): string;
    getDefaultOperationKind(category: string, isTrigger: boolean): string;
    getExtraOperations(category: string, kind: string): RecommendationOperation[];
    getExtraOperationsByConnector?(category: string, connectorId: string, kind: string): Promise<RecommendationOperation[]>;
    getOperationKindsByCategory(category: string): RecommendationOperationKind[];
    getOperationsByCategory(category: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;
    getOperationsByConnector(category: string, connector: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;
    getOperationsByContinuationToken(category: string, continuationToken: string): Promise<RecommendationResults<RecommendationOperation>>;
    getProvider(category: string): IRecommendationProvider;
    getSearchBoxPlaceholder(category: string, kind: string): string;
    getUserVoicePropsByCategory(category: string): RecommendationUserVoiceProps;
    goBack(category: string): string;
    selectConnector(category: string, connectorId: string, kind: string): string;
    selectOperation(category: string, operationId: string, kind: string): string;
    setContext?(recommendationContext?: RecommendationContext): Promise<void>;
    shouldAllowTriggerSelectionAsAction?(category: string, connectorId: string, operationId: string, kind: string): boolean;
}

interface IRecommendationServiceOptions {
    // The API version for the API, e.g., 2019-09-01
    apiVersion: string;

    // The base URL for the API, e.g., https://logicapps/api/management
    baseUrl: string;

    builtInTypeService: IBuiltInTypeService;
}

interface EnvironmentBadge {
    description: string;
    name: string;
}

export interface RecommendationCategory {
    itemKey: string;
    linkText: string;
}

enum RecommendationCategoryKey {
    ALL = "ALL",
    BUILTIN = "BUILTIN",
    STANDARD = "STANDARD"
}

export interface RecommendationConnector {
    brandColor: string;
    category?: string;
    environmentBadge?: EnvironmentBadge;
    icon: string;
    id: string;
    isIseConnector?: boolean;
    promotionIndex?: number;
    title: string;
}

interface RecommendationContext {
}

export interface RecommendationOperation {
    brandColor: string;
    connector?: string;
    connectorKind?: string;
    description: string;
    environmentBadge?: EnvironmentBadge;
    icon: string;
    id: string;
    important?: boolean;
    isIseConnectorOperation?: boolean;
    operationType?: string;
    premium?: boolean;
    preview?: boolean;
    promotionIndex?: number;
    subtitle: string;
    title: string;
}

export interface RecommendationOperationKind {
    itemKey: string;
    linkText: string;
}

export interface RecommendationResults<T> {
    nextLink?: string;
    rawValue: any[];
    value: T[];
}

export interface RecommendationUserVoiceProps {
    disabled?: boolean;
    segments: RecommendationUserVoiceSegment[];
}

interface RecommendationUserVoiceSegment {
    disabled?: boolean;
    href?: string;
    text: string;
}

export class RecommendationService implements IRecommendationService {
    private readonly providers: Record<string, IRecommendationProvider>;

    public constructor(options: IRecommendationServiceOptions) {
        this.providers = {
            [RecommendationCategoryKey.ALL]: new AllProvider(options),
            [RecommendationCategoryKey.BUILTIN]: new BuiltInProvider(options),
            [RecommendationCategoryKey.STANDARD]: new StandardConnectorProvider(options)
        };
    }

    public getCategories(): RecommendationCategory[] {
        return [
            {
                itemKey: RecommendationCategoryKey.ALL,
                linkText: "All"
            },
            {
                itemKey: RecommendationCategoryKey.BUILTIN,
                linkText: "Built-in"
            },
            {
                itemKey: RecommendationCategoryKey.STANDARD,
                linkText: "Standard"
            }
        ];
    }

    public getConnectorBrandColor(category: string, rawConnector: any): string {
        return this.getProvider(category).getConnectorBrandColor(rawConnector);
    }

    public getConnectorIcon(category: string, rawConnector: any): string {
        return this.getProvider(category).getConnectorIcon(rawConnector);
    }

    public getConnectorTitle(category: string, rawConnector: any): string {
        return this.getProvider(category).getConnectorTitle(rawConnector);
    }

    public getConnectorsByCategory(category: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>> {
        return this.getProvider(category).getConnectors(filterText, kind);
    }

    public getConnectorsByContinuationToken(category: string, continuationToken: string): Promise<RecommendationResults<RecommendationConnector>> {
        return this.getProvider(category).getConnectorsByContinuationToken(continuationToken);
    }

    public getDefaultCategoryKey(): string {
        return RecommendationCategoryKey.ALL;
    }

    public getDefaultOperationKind(category: string, isTrigger: boolean): string {
        return this.getProvider(category).getDefaultOperationKind(isTrigger);
    }

    public getExtraOperations(category: string, kind: string): RecommendationOperation[] {
        return this.getProvider(category).getExtraOperations(kind);
    }

    public async getExtraOperationsByConnector?(category: string, connectorId: string, kind: string): Promise<RecommendationOperation[]> {
        const provider = this.getProvider(category);
        if ("getExtraOperationsByConnector" in provider) {
            return provider.getExtraOperationsByConnector!(connectorId, kind);
        } else {
            return [];
        }
    }

    public getOperationKindsByCategory(category: string): RecommendationOperationKind[] {
        return this.getProvider(category).getOperationKinds();
    }

    public getOperationsByCategory(category: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        return this.getProvider(category).getOperations(filterText, kind);
    }

    public getOperationsByConnector(category: string, connector: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
        return this.getProvider(category).getOperationsByConnector(connector, filterText, kind);
    }

    public getOperationsByContinuationToken(category: string, continuationToken: string): Promise<RecommendationResults<RecommendationOperation>> {
        return this.getProvider(category).getOperationsByContinuationToken(continuationToken);
    }

    public getProvider(category: string): IRecommendationProvider {
        return this.providers[category];
    }

    public getSearchBoxPlaceholder(category: string, kind: string): string {
        return this.getProvider(category).getSearchBoxPlaceholder(kind);
    }

    public getUserVoicePropsByCategory(category: string): RecommendationUserVoiceProps {
        return this.getProvider(category).getUserVoiceProps();
    }

    public goBack(category: string): string {
        return this.getProvider(category).goBack();
    }

    public selectConnector(category: string, connectorId: string, kind: string): string {
        return this.getProvider(category).selectConnector(connectorId, kind);
    }

    public selectOperation(category: string, operationId: string, kind: string): string {
        return this.getProvider(category).selectOperation(operationId, kind);
    }

    public shouldAllowTriggerSelectionAsAction?(category: string, connectorId: string, operationId: string, kind: string): boolean {
        const provider = this.getProvider(category);
        if ("shouldAllowTriggerSelectionAsAction" in provider) {
            return provider.shouldAllowTriggerSelectionAsAction!(connectorId, operationId, kind);
        } else {
            return false;
        }
    }
}
