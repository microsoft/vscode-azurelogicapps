/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

enum EventType {
    Error = "Error",
    Request = "Request",
    Telemetry = "Telemetry",
    Trace = "Trace"
}

interface IAnalyticsService {
    flush(): Promise<void>;
    getContext(): AnalyticsContext | undefined;
    logError(eventName: string, error: Error, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
    logHttpRequestEnd(eventName: string, httpMethod: string, targetUri: string, responseData: ResponseData, preciseDurationInMilliseconds: number, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
    logHttpRequestStart(eventName: string, httpMethod: string, targetUri: string, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
    logInfo(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
    logWarning(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
    performanceNow(): number;
    profile(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimestamp?: Date | number, eventId?: string): void;
    profileEnd(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimestamp?: Date, eventId?: string): void;
    profileStart(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimestamp?: Date, eventId?: string): void;
    replaceContextData(contextData: any): void;
    setContextData(contextData: any): void;
    trackEvent(eventName: string, data: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
}

interface IAnalyticsServiceOptions {
    postMessage(message: any): void;
}

interface AnalyticsContext extends UserAgent {
    data?: any;
    windowLocationHref?: string;
}

interface ResponseData {
    apiVersion?: string;
    contentLength?: number;
    data?: any;
    hostName?: string;
    responseBodyOnError?: any;
    serviceRequestId?: string;
    status: number;
}

interface UserAgent {
    browserArch?: string;
    browserName?: string;
    browserVersion?: string;
    osArch?: string;
    osName?: string;
    osVersion?: string;
    screenResolution?: string;
}

export class AnalyticsService implements IAnalyticsService {
    private contextData: any = {};
    private readonly profileStartTimestamps: Record<string, number> = {};

    public constructor(private readonly options: IAnalyticsServiceOptions) {
    }

    public async flush(): Promise<void> {
    }

    public getContext(): AnalyticsContext | undefined {
        return {
            data: this.contextData
        };
    }

    public logError(eventName: string, error: any, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        let message: string;
        if (typeof error === "string") {
            message = error;
        } else if (error !== undefined) {
            message = error.message || "";
        } else {
            message = "";
        }

        this.options.postMessage({
            data,
            eventCorrelationId,
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Error,
            exception: serializeErrorToJson(error),
            message
        });
    }

    public logHttpRequestEnd(eventName: string, httpMethod: string, targetUri: string, responseData: ResponseData, preciseDurationInMilliseconds: number, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        const { apiVersion, contentLength, hostName, responseBodyOnError, serviceRequestId, status: httpStatusCode } = responseData;
        this.options.postMessage({
            ...clientRequestId !== undefined ? { clientRequestId } : undefined,
            contentLength,
            data: JSON.stringify(data, null, 4),
            durationInMilliseconds: Math.round(preciseDurationInMilliseconds),
            eventCorrelationId,
            eventData: {
                ...apiVersion !== undefined ? { apiVersion } : undefined,
                ...hostName !== undefined ? { hostName } : undefined,
                preciseDurationInMilliseconds,
                request: "end",
                ...responseBodyOnError !== undefined ? { responseBodyOnError } : undefined,
                ...serviceRequestId !== undefined ? { serviceRequestId } : undefined
            },
            eventId,
            eventName,
            eventTimestamp,
            httpMethod,
            httpStatusCode,
            targetUri
        });
    }

    public logHttpRequestStart(eventName: string, httpMethod: string, targetUri: string, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        this.options.postMessage({
            ...clientRequestId !== undefined ? { clientRequestId } : undefined,
            data: JSON.stringify(data, null, 4),
            eventCorrelationId,
            eventData: {
                request: "start"
            },
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Request,
            httpMethod,
            targetUri
        });
    }

    public logInfo(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        this.options.postMessage({
            code: "info",
            data: JSON.stringify(data, null, 4),
            eventCorrelationId,
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Trace,
            message
        });
    }

    public logWarning(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        this.options.postMessage({
            code: "warning",
            data: JSON.stringify(data, null, 4),
            eventCorrelationId,
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Trace,
            message
        });
    }

    public performanceNow(): number {
        return performance.now();
    }

    public profile(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds: number, eventTimestamp?: Date, eventId?: string): void {
        this.options.postMessage({
            data: JSON.stringify(data, null, 4),
            durationInMilliseconds: Math.round(preciseDurationInMilliseconds),
            eventCorrelationId,
            eventData: {
                profile: "profile",
                preciseDurationInMilliseconds
            },
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Telemetry
        });
    }

    public profileEnd(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimestamp?: Date, eventId?: string): void {
        eventTimestamp = eventTimestamp || new Date();
        preciseDurationInMilliseconds = preciseDurationInMilliseconds || this.performanceNow() - this.profileStartTimestamps[eventCorrelationId];
        delete this.profileStartTimestamps[eventCorrelationId];

        this.options.postMessage({
            data: JSON.stringify(data, null, 4),
            durationInMilliseconds: Math.round(preciseDurationInMilliseconds),
            eventCorrelationId,
            eventData: {
                profile: "end",
                preciseDurationInMilliseconds
            },
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Telemetry
        });
    }

    public profileStart(eventCorrelationId: string, eventName: string, data: any, profileStartTimestamp?: number, eventTimestamp?: Date, eventId?: string): void {
        eventTimestamp = eventTimestamp || new Date();
        profileStartTimestamp = profileStartTimestamp || this.performanceNow();
        this.profileStartTimestamps[eventCorrelationId] = profileStartTimestamp;

        this.options.postMessage({
            data: JSON.stringify(data, null, 4),
            eventCorrelationId,
            eventData: {
                profile: "start"
            },
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Telemetry
        });
    }

    public replaceContextData(contextData: any): void {
        this.contextData = contextData;
    }

    public setContextData(contextData: any): void {
        this.contextData = {
            ...this.contextData,
            ...contextData
        };
    }

    public trackEvent(eventName: string, data: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        this.options.postMessage({
            data: JSON.stringify(data, null, 4),
            eventCorrelationId,
            eventData: {},
            eventId,
            eventName,
            eventTimestamp,
            eventType: EventType.Telemetry
        });
    }
}

function serializeErrorToJson(error: any): any {
    if (error === null || error === undefined) {
        return null;
    } else if (typeof error === "string" || typeof error === "number" || typeof error === "boolean") {
        return error;
    } else {
        return {
            ...error,
            innerException: serializeErrorToJson(error.innerException),
            message: error.message,
            stack: error.stack
        };
    }
}
