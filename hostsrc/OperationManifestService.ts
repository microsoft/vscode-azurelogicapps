/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

interface IOperationManifestService {
    getOperationInfo(definition: any): Promise<OperationInfo>;
    getOperationManifest(connectorId: string, operationId: string): Promise<OperationManifest>;
    getSplitOnOutputs(connectorId: string, operationId: string, splitOn?: SplitOn): any;
    isSupported(operationType: string, operationKind?: string): boolean;
}

interface IOperationManifestServiceOptions {
    operationManifestService: IOperationManifestService;
}

interface OperationInfo {
    connectorId: string;
    operationId: string;
}

interface OperationManifest {
}

type SplitOn = string | any[];

const supportedConnectorIds: string[] = [
    "connectionProviders/dataOperation",
    "connectionProviders/schedule"
];

const supportedOperationIds: string[] = [
    "compose",
    "delay",
    "delay_until",
    "recurrence",
    "slidingwindow"
];

const supportedTypes: string[] = [
    "compose",
    "recurrence",
    "slidingwindow",
    "wait"
];

const collator = new Intl.Collator("en-US", { sensitivity: "base" });

export class OperationManifestService implements IOperationManifestService {
    public constructor(private readonly options: IOperationManifestServiceOptions) {
    }

    public async getOperationInfo(definition: any): Promise<OperationInfo> {
        const operationInfo = await this.options.operationManifestService.getOperationInfo(definition);
        this.ensureOperationTypeIsSupported(operationInfo);
        return operationInfo;
    }

    public async getOperationManifest(connectorId: string, operationId: string): Promise<OperationManifest> {
        const operationInfo: OperationInfo = {
            connectorId,
            operationId
        };
        this.ensureOperationTypeIsSupported(operationInfo);
        return this.options.operationManifestService.getOperationManifest(connectorId, operationId);
    }

    public getSplitOnOutputs(connectorId: string, operationId: string, splitOn?: SplitOn): any {
        const operationInfo: OperationInfo = {
            connectorId,
            operationId
        };
        this.ensureOperationTypeIsSupported(operationInfo);
        return this.options.operationManifestService.getSplitOnOutputs(connectorId, operationId, splitOn);
    }

    public isSupported(operationType: string, operationKind?: string): boolean {
        return isSupportedType(operationType) && this.options.operationManifestService.isSupported(operationType, operationKind);
    }

    private ensureOperationTypeIsSupported(operationInfo: OperationInfo): void {
        const { connectorId, operationId } = operationInfo;
        if (!isSupportedConnector(connectorId)) {
            throw new Error(`Connector '${connectorId}' not supported`);
        } else if (!isSupportedOperation(operationId)) {
            throw new Error(`Operation '${operationId}' not supported`);
        }
    }
}

function isSupportedConnector(connectorId: string): boolean {
    return supportedConnectorIds.some(supportedConnectorId => collator.compare(supportedConnectorId, connectorId) === 0);
}

function isSupportedOperation(operationId: string): boolean {
    return supportedOperationIds.some(supportedOperationId => collator.compare(supportedOperationId, operationId) === 0);
}

function isSupportedType(type: string): boolean {
    return supportedTypes.some(supportedType => collator.compare(supportedType, type) === 0);
}
