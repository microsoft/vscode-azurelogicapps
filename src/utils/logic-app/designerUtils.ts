/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Sku } from "azure-arm-logic/lib/models";
import { Callbacks } from "./callbackUtils";
import { ConnectionReferences } from "./connectionReferenceUtils";

interface IGetWebviewContentOptions {
    authorization: string;
    callbacks: Callbacks;
    definition: string;
    integrationAccountId?: string;
    location: string;
    references: ConnectionReferences;
    resourceGroupName: string;
    sku?: Sku;
    subscriptionId: string;
    title: string;
    workflowId: string;
}

const version = "1.31126.1.513093.181130-1946";

export function getWebviewContentForDesigner({ authorization, callbacks, definition, integrationAccountId, location, references, resourceGroupName, sku, subscriptionId, title, workflowId }: IGetWebviewContentOptions): string {
    sku = sku || { name: "Consumption" };

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="img-src data: https: 'unsafe-inline'; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://ema.hosting.portal.azure.net/ema/Content/${version}/Html/styles/Draft.css">
    <link rel="stylesheet" href="https://ema.hosting.portal.azure.net/ema/Content/${version}/Html/styles/fabric.min.css">
    <link rel="stylesheet" href="https://ema.hosting.portal.azure.net/ema/Content/${version}/Html/styles/designer.min.css">
    <style>
        body {
            background-color: #f2f2f2;
            margin-top: 4em;
        }
    </style>
    <title>${title}</title>
</head>
<body>
    <div id="designer"></div>
    <script src="https://ema.hosting.portal.azure.net/ema/Content/${version}/Scripts/EMAExtension/Client/logicappdesigner/require.min.js"></script>
    <script>
        (global => {
            "use strict";

            const $locale = "en";

            const baseUrl = "https://ema.hosting.portal.azure.net/ema/Content/${version}/Scripts/EMAExtension/Client/logicappdesigner/";

            function getMonacoLocale(locale) {
                // Mapping of the languages Monaco editor supports. Default to english for non-supported languages.
                const monacoLocalesMap = {
                    "de": "de",
                    "es": "es",
                    "fr": "fr",
                    "it": "it",
                    "ja": "ja",
                    "ko": "ko",
                    "ru": "ru",
                    "zh-hans": "zh-cn",
                    "zh-hant": "zh-tw"
                };

                return monacoLocalesMap[locale] || "en";
            }

            function getResourcePath(locale) {
                if (locale === "en" || !locale) {
                    return "resources.logicapps.min";
                } else {
                    return \`loc_gen/\${locale}/resources.logicapps.min\`;
                }
            }

            const r = requirejs.config({
                baseUrl,
                map: {
                    "*": {
                        "office-ui-fabric-react/lib/common/DirectionalHint": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ActivityItem": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Autofill": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Breadcrumb": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Button": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Calendar": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Callout": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Check": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Checkbox": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ChoiceGroup": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Coachmark": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Color": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ColorPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ComboBox": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/CommandBar": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ContextualMenu": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/DatePicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/DetailsList": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Dialog": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/DocumentCard": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Dropdown": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Fabric": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Facepile": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/FloatingPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/FocusTrapZone": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/FocusZone": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Grid": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/GroupedList": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/HoverCard": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Icon": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Icons": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Image": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Keytip": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/KeytipData": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/KeytipLayer": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Label": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Layer": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Link": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/List": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/MarqueeSelection": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/MessageBar": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Modal": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Nav": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/OverflowSet": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Overlay": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Panel": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Persona": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/PersonaCoin": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Pickers": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Pivot": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Popup": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ProgressIndicator": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Rating": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ResizeGroup": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ScrollablePane": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SearchBox": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SelectableOption": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SelectedItemsList": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Selection": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Shimmer": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Slider": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Spinner": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Sticky": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Styling": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SwatchColorPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/TeachingBubble": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/TextField": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ThemeGenerator": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Toggle": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Tooltip": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Utilities": "office-ui-fabric-react",
                        "reselect": "Reselect"
                    }
                },
                paths: {
                    "@microsoft/load-themed-styles": "@microsoft/load-themed-styles/lib-amd/index",
                    "@uifabric/icons/lib": "@uifabric/icons",
                    "@uifabric/merge-styles/lib": "@uifabric/merge-styles",
                    "@uifabric/styling/lib": "@uifabric/styling",
                    "@uifabric/utilities/lib": "@uifabric/utilities",
                    "cds-control-expression": "cds-control-expression",
                    "core/main": "core.all.min",
                    "draft-js": "draft.min",
                    "draft-js-export-html": "draft-js-export-html.min",
                    "draft-js-import-html": "draft-js-import-html.min",
                    "fuse": "fuse.min",
                    "immutable": "immutable.min",
                    "localforage": "localforage.min",
                    "oauth": "../Workflow/OAuth/OAuthService",
                    "office-ui-fabric-react": "office-ui-fabric-react.min",
                    "prop-types": "prop-types.min",
                    "react": "react.production.min",
                    "react-dnd": "react-dnd-bundle/react-dnd/dist/ReactDnD.min",
                    "react-dnd-html5-backend": "react-dnd-bundle/react-dnd-html5-backend/dist/ReactDnDHTML5Backend.min",
                    "react-dom": "react-dom.production.min",
                    "react-draft-wysiwyg": "react-draft-wysiwyg.min",
                    "reselect": "reselect",
                    "re-reselect": "re-reselect",
                    "resources": getResourcePath(),
                    "SwaggerParser": "swagger-parser.min",
                    "tslib": "tslib"
                },
                shim: {
                    "office-ui-fabric-react": {
                        "deps": ["prop-types", "react", "react-dom", "tslib"],
                        "exports": "Fabric"
                    }
                }
            });

            r(["immutable", "react", "react-dom"], (Immutable, React, ReactDOM) => {
                global.Immutable = Immutable;
                global.React = React;
                global.ReactDOM = ReactDOM;

                r(["draft-js"], Draft => {
                    global.Draft = Draft;

                    r(["SwaggerParser", "resources", "core/main", "oauth"], (SwaggerParser, resources, designercore, OAuth) => {
                        designercore.requireScriptForEditor("https://ema.hosting.portal.azure.net/ema/Content/${version}/Scripts/EMAExtension/Client/logicappdesigner/monaco/min/vs");

                        const monacoLocale = getMonacoLocale($locale);

                        if (monacoLocale !== "en") {
                            global.require.config({
                                "vs/nls": {
                                    availableLanguages: {
                                        "*": monacoLocale
                                    }
                                }
                            });
                        }

                        const oauthService = new OAuth.OAuthPopupService("https://portal.azure.com");

                        const getArmAccessToken = async () => {
                            return "${authorization}".substring("Bearer ".length);
                        };

                        const getCurrentTenantId = async () => {
                        };

                        const getCurrentUserObjectId = async () => {
                        };

                        let designer;

                        function initialize(options, analyticsContextData) {
                            const config = {
                                apiOperationsPath: \`/providers/Microsoft.Web/locations/\${options.location}/apiOperations\`,
                                connectionsPath: "/providers/Microsoft.Web/connections",
                                connectionProvidersPath: \`/providers/Microsoft.Web/locations/\${options.location}/managedApis\`,
                                gatewaysPath: "/providers/Microsoft.Web/connectionGateways"
                            };

                            const urlService = new designercore.LogicAppsUrlService({
                                baseUrl: options.baseUrl,
                                config,
                                integrationAccountId: options.integrationAccountId,
                                location: options.location,
                                resourceGroup: options.resourceGroup,
                                subscriptionId: options.subscriptionId
                            });

                            const apiManagementServiceFactory = analytics => {
                                return new designercore.LogicAppsApiManagementService({
                                    analytics,
                                    apiVersion: options.apiManagementApiVersion,
                                    baseUrl: options.baseUrl,
                                    getAccessToken: getArmAccessToken,
                                    locale: $locale,
                                    subscriptionId: options.subscriptionId
                                });
                            };

                            const hostServiceFactory = () => ({
                            });

                            const analyticsServiceFactory = version => {
                                const telemetryBaseUrl = options.telemetryBaseUrl || options.baseUrl;
                                const telemetryVersion = options.telemetryVersion || options.emaApiVersion;
                                const settings = {
                                    analyticsServiceUri: \`\${telemetryBaseUrl}/providers/Internal.Telemetry/collect?api-version=\${options.telemetryVersion}\`,
                                    getAccessToken: getArmAccessToken
                                };

                                const contextData = analyticsContextData || {};
                                contextData.host = window.location.host;
                                contextData.hostVersion = options.extensionVersion;
                                contextData.designerVersion = version;

                                const analyticsService = new designercore.AnalyticsService(settings, contextData);
                                analyticsService.startPublish();

                                return analyticsService;
                            }

                            const iseSupported = !!options.featureFlags && !!options.featureFlags.enableintegrationserviceenvironment;

                            const connectionServiceFactory = analytics => {
                                return new designercore.LogicAppsConnectionService({
                                    analytics,
                                    apiVersion: options.connectionApiVersion,
                                    apiVersionForConnection: iseSupported ? options.integrationServiceEnvironmentApiVersion : options.connectionApiVersion,
                                    apiVersionForCustomConnector: iseSupported ? options.integrationServiceEnvironmentApiVersion : options.connectionApiVersion,
                                    apiVersionForGateways: options.connectionApiVersion,
                                    apiVersionForIseManagedConnector: iseSupported ? options.integrationServiceEnvironmentApiVersion : options.connectionApiVersion,
                                    apiVersionForSharedManagedConnector: iseSupported ? options.integrationServiceEnvironmentApiVersion : options.connectionApiVersion,
                                    baseUrl: options.baseUrl,
                                    batchApiVersion: options.batchApiVersion,
                                    getAccessToken: getArmAccessToken,
                                    integrationServiceEnvironmentId: options.integrationServiceEnvironmentId,
                                    isIntegrationServiceEnvironmentSupported: iseSupported,
                                    oauthService,
                                    locale: $locale,
                                    location: options.location,
                                    urlService
                                });
                            };

                            const connectionConfigurationServiceFactory = analytics => {
                                return new designercore.LogicAppsConnectionConfigurationService({
                                    analytics,
                                    baseUrl: options.baseUrl,
                                    getAccessToken: getArmAccessToken,
                                    locale: $locale,
                                    subscriptionId: options.subscriptionId
                                });
                            };

                            const identityServiceFactory = analytics => {
                                return new designercore.LogicAppsIdentityService({
                                    analytics,
                                    baseUrl: options.baseUrl,
                                    getAccessToken: getArmAccessToken,
                                    currentTenantId: getCurrentTenantId(),
                                    apiVersion: options.armApiVersion
                                });
                            };

                            const builtInTypeServiceFactory = (analytics, schemaVersion) => {
                                const options = {
                                    httpManagedServiceIdentitySupported: true,
                                    openApiConnection: false,
                                    showScopeActions: true,
                                    showVariableActions: true
                                };

                                return new designercore.LogicAppsBuiltInTypeService(schemaVersion, options);
                            };

                            const functionServiceFactory = analytics => {
                                return new designercore.LogicAppsFunctionService({
                                    analytics,
                                    apiVersion: options.azureFunctionApiVersion,
                                    baseUrl: options.baseUrl,
                                    getAccessToken: getArmAccessToken,
                                    locale: $locale,
                                    urlService
                                });
                            };

                            const workflowServiceFactory = analytics => {
                                return new designercore.LogicAppsWorkflowService({
                                    analytics,
                                    apiVersion: options.emaApiVersion,
                                    baseUrl: options.baseUrl,
                                    getAccessToken: getArmAccessToken,
                                    locale: $locale,
                                    urlService
                                });
                            };

                            const promotedConnectorsForActions = iseSupported && options.integrationServiceEnvironmentId
                                ? [
                                    "connectionProviders/control",
                                    "connectionProviders/http",
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/servicebus\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/servicebus\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/sql\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/sql\`,
                                    "connectionProviders/function",
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/office365\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/office365\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/azureblob\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/azureblob\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/cognitiveservicestextanalytics\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/cognitiveservicestextanalytics\`
                                ]
                                : [
                                    "connectionProviders/control",
                                    "connectionProviders/http",
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/servicebus\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/sql\`,
                                    "connectionProviders/function",
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/office365\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/azureblob\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/cognitiveservicestextanalytics\`,
                                ];

                            const promotedConnectorsForTriggers = iseSupported && options.integrationServiceEnvironmentId
                                ? [
                                    "connectionProviders/request",
                                    "connectionProviders/schedule",
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/servicebus\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/servicebus\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/twitter\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/twitter\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/office365\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/office365\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/sharepointonline\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/sharepointonline\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/ftp\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/ftp\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/dynamicscrmonline\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/dynamicscrmonline\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/sftp\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/sftp\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/salesforce\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/salesforce\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/rss\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/rss\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/onedrive\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/onedrive\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/azureeventgrid\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/azureeventgrid\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/azurequeues\`,
                                    \`\${options.integrationServiceEnvironmentId}/managedApis/azurequeues\`
                                ]
                                : [
                                    "connectionProviders/request",
                                    "connectionProviders/schedule",
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/servicebus\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/twitter\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/office365\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/sharepointonline\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/ftp\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/dynamicscrmonline\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/sftp\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/salesforce\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/rss\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/onedrive\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/azureeventgrid\`,
                                    \`/subscriptions/\${options.subscriptionId}/providers/Microsoft.Web/locations/\${options.location}/managedApis/azurequeues\`
                                ];

                            const featuresToEnable = {
                                ALLOW_EMPTY_DEFINITION: true,
                                AUTO_CASTING_IN_PARAMETER_FIELD_TIP: true,
                                CONCURRENCY: true,
                                DEBOUNCE_EMIT_CHANGE: true,
                                DISABLE_TOKEN_PICKER_COMPACT_MODE: true,
                                FILTER_RECOMMENDATION: true,
                                FX_TOKEN: true,
                                FILTER_TOKEN_PICKER_WITH_TYPE_AND_FORMAT: true,
                                FX_TOKEN_FOR_CONDITION: true,
                                GATEWAY_FOR_CONNECTION: true,
                                HTML_EDITOR: true,
                                INITIALIZE_DYNAMIC_CONTENT_ASYNC: true,
                                NEW_CONDITION_RULES_BUILDER: true,
                                NEW_RECOMMENDATION_CARD_WITH_FOR_YOU: true,
                                NEW_RECOMMENDATION_CARD_WITH_MODULES: true,
                                NEW_SCHEMA_EDITOR: true,
                                RAW_MODE: true,
                                SHOW_CONNECTION_NAME: true,
                                SHOW_INSERT_ACTION_BUTTON: true,
                                SHOW_PARENT_OBJECT_FOR_OUTPUTS: true,
                                SHOW_SOFT_LANDING_TIPS: true,
                                SHOW_TOKENS_FOR_FOREACH: !!options.featureFlags && !!options.featureFlags.showforeachtokens,
                                SHOW_TRIGGER_RECURRENCE: true,
                                SHOW_VARIABLE_ACTIONS: true,
                                SUPPORT_INTEGRATION_SERVICE_ENVIRONMENT: iseSupported,
                                SUPPORT_NESTED_FOREACH_UI: true,
                                SUPPORT_PAN_AND_ZOOM: true,
                                SUPPORT_PEEK: true,
                                TOKEN_COPY_PASTE: true,
                                USE_CONNECTION_CONFIGURATION_SERVICE: true,
                                USE_DICTIONARY_EDITOR: true,
                                USE_EDITOR_INPUT: true,
                                USE_NEW_EXPRESSION_PARSER: true
                            };

                            const recommendationServiceFactory = (analytics, schemaVersion) => {
                                return new designercore.LogicAppsSmartRecommendationService({
                                    analytics,
                                    apiVersion: options.integrationServiceEnvironmentApiVersion,
                                    apiVersionForApiManagement: options.apiManagementApiVersion,
                                    apiVersionForApiOperations: options.integrationServiceEnvironmentApiVersion,
                                    apiVersionForCustomConnector: options.integrationServiceEnvironmentApiVersion,
                                    apiVersionForLogicApps: options.integrationServiceEnvironmentApiVersion,
                                    apiVersionForManagedConnector: options.integrationServiceEnvironmentApiVersion,
                                    apiVersionForWeb: options.azureFunctionApiVersion,
                                    baseUrl: options.baseUrl,
                                    getAccessToken: getArmAccessToken,
                                    hideCustomConnectors: options.hideCustomConnectors,
                                    integrationServiceEnvironmentId: options.integrationServiceEnvironmentId,
                                    isIntegrationServiceEnvironmentSupported: iseSupported,
                                    locale: $locale,
                                    location: options.location,
                                    promotedConnectorsForActions,
                                    promotedConnectorsForTriggers,
                                    promotedOperationsForActions: [
                                        "connectionProviders/request"
                                    ],
                                    resourceGroup: options.resourceGroup,
                                    resourceId: analyticsContextData.resourceData.resourceId,
                                    schemaVersion,
                                    subscription: options.subscriptionId,
                                    smartRecommendationServiceOptions: {
                                        getMruKey: () => {
                                            return getCurrentUserObjectId().then(objectId => {
                                                return options.subscriptionId + objectId;
                                            });
                                        },
                                        recommendOperationGroupsPath: \`/subscriptions/\${options.subscriptionId}/resourceGroups/\${options.resourceGroup}/providers/Microsoft.Logic/locations/\${options.location}/workflows/\${options.logicAppName}/recommendOperationGroups\`
                                    }
                                });
                            };

                            const flowConfigurationOptions = {
                                analyticsServiceFactory,
                                apiManagementServiceFactory,
                                apiVersion: options.emaApiVersion,
                                azureFunctionsApiVersion: options.azureFunctionApiVersion,
                                baseUrl: options.baseUrl,
                                batchApiVersion: options.batchApiVersion,
                                builtInTypeServiceFactory,
                                connectionConfigurationServiceFactory: connectionConfigurationServiceFactory,
                                connectionGatewayApiVersion: options.connectionGatewayApiVersion,
                                connectionServiceFactory,
                                dynamicCallApiVersion: options.connectionApiVersion, // Service in the designer side uses connections api to make proxy call for dynamic content.
                                features: featuresToEnable,
                                functionServiceFactory,
                                getArmAccessToken,
                                getRuntimeAccessToken: getArmAccessToken,
                                host: window.location.host,
                                hostEnvironment: designercore.Host.LogicApps,
                                hostServiceFactory,
                                hostVersion: options.extensionVersion,
                                identityServiceFactory,
                                locale: $locale,
                                oauthService,
                                prefetchedData: {
                                    connectionProviders: !!options.connectionProviders ? JSON.parse(options.connectionProviders) : undefined
                                },
                                recommendationServiceFactory,
                                startTelemetryPublish: true,
                                telemetryBaseUrl: options.telemetryBaseUrl,
                                telemetryVersion: options.telemetryVersion,
                                urlService,
                                workflowServiceFactory
                            };

                            disposeDesigner();

                            designer = window.designer = new designercore.Designer(flowConfigurationOptions, document.getElementById("designer"));
                        }

                        function loadDefinition(logicApp, callbacks, options) {
                            const { definition, references, sku } = logicApp;
                            const loadOptions = { ...options };
                            const workflow = {
                                definition,
                                references,
                                properties: {
                                    callbacks,
                                    sku
                                }
                            };

                            return designer.loadWorkflow(workflow, loadOptions);
                        }

                        function disposeDesigner() {
                            if (designer) {
                                designer.dispose();
                                designer = null;
                            }
                        }

                        (async () => {
                            const options = {
                                apiManagementApiVersion: "2015-09-15",
                                armApiVersion: "2017-08-01",
                                azureFunctionApiVersion: "2015-08-01",
                                baseUrl: "https://management.azure.com",
                                batchApiVersion: "2015-11-01",
                                connectionApiVersion: "2016-06-01",
                                connectionGatewayApiVersion: "2016-06-01",
                                emaApiVersion: "2016-10-01",
                                enableMock: false,
                                extensionVersion: "${version}",
                                featureFlags: {
                                    enableintegrationserviceenvironment: false,
                                    htmleditor: false,
                                    showforeachtokens: false
                                },
                                hideCustomConnectors: false,
                                integrationAccountId: ${integrationAccountId !== undefined ? `"${integrationAccountId}"` : "undefined"},
                                integrationServiceEnvironmentApiVersion: "2018-07-01-preview",
                                location: "${location}",
                                resourceGroup: "${resourceGroupName}",
                                subscriptionId: "${subscriptionId}",
                                telemetryBaseUrl: "https://management.azure.com",
                                telemetryVersion: "2015-09-30-preview"
                            };

                            const analyticsContextData = {
                                resourceData: {
                                    resourceId: "${workflowId}",
                                    source: "vscodeDesigner"
                                }
                            };

                            const logicApp = {
                                definition: ${definition},
                                references: ${JSON.stringify(references)},
                                sku: ${JSON.stringify(sku)}
                            };

                            const callbacks = ${JSON.stringify(callbacks)};

                            const workflowOptions = {
                                initReadonly: true
                            };

                            await initialize(options, analyticsContextData);
                            await loadDefinition(logicApp, callbacks, workflowOptions);

                            designer.render();
                        })();
                    });
                });
            });
        })(window);
    </script>
</body>
</html>
`;
}
