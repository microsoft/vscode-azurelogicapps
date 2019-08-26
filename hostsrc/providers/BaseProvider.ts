/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRecommendationProvider, IRecommendationProviderOptions, RecommendationConnector, RecommendationOperation, RecommendationOperationKind, RecommendationResults, RecommendationUserVoiceProps } from "../RecommendationService";

export enum OperationKind {
    TRIGGERS = "TRIGGERS",
    ACTIONS = "ACTIONS"
}

const collator = new Intl.Collator("en-US", { sensitivity: "base" });

export abstract class BaseProvider<T extends IRecommendationProviderOptions> implements IRecommendationProvider {
    public constructor(protected readonly options: T) {
    }

    public abstract getConnectorBrandColor(rawConnector: any): string;

    public abstract getConnectorIcon(rawConnector: any): string;

    public abstract getConnectorTitle(rawConnector: any): string;

    public abstract getConnectors(filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>>;

    public abstract getConnectorsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationConnector>>;

    public getDefaultOperationKind(isTrigger: boolean): string {
        return isTrigger ? OperationKind.TRIGGERS : OperationKind.ACTIONS;
    }

    public getExtraOperations(): RecommendationOperation[] {
        return [];
    }

    public getOperationKinds(): RecommendationOperationKind[] {
        return [
            {
                linkText: "Triggers",
                itemKey: OperationKind.TRIGGERS
            },
            {
                linkText: "Actions",
                itemKey: OperationKind.ACTIONS
            }
        ];
    }

    public abstract getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

    public abstract getOperationsByConnector(connectorId: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

    public abstract getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>>;

    public getSearchBoxPlaceholder(kind: string): string {
        return kind === OperationKind.TRIGGERS ? "Search connectors and triggers" : "Search connectors and actions";
    }

    public getUserVoiceProps(): RecommendationUserVoiceProps {
        return {
            segments: [
                {
                    text: "Help us decide which connectors and triggers to add next with "
                },
                {
                    href: "https://aka.ms/logicapps-wish",
                    text: "UserVoice"
                }
            ]
        };
    }

    public goBack(): string {
        return "DEFAULT";
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public selectConnector(_connectorId: string, _kind: string): string {
        return "DEFAULT";
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public selectOperation(_operationId: string, _kind: string): string {
        return "DEFAULT";
    }
}

export function compareByRecommendationConnector(a: RecommendationConnector, b: RecommendationConnector): number {
    return collator.compare(a.title, b.title);
}

export function compareByRecommendationOperation(a: RecommendationOperation, b: RecommendationOperation): number {
    return collator.compare(a.subtitle, b.subtitle) || collator.compare(a.title, b.title);
}

export function includes(string: string, substring: string): boolean {
    return string.toLocaleLowerCase().indexOf(substring.toLocaleLowerCase()) !== -1;
}
