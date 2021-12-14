/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Constants } from "../../constants";

interface IGetWebviewContentOptions {
    authorization: string;
    location: string;
    resourceGroupName: string;
    runId: string;
    subscriptionId: string;
    title: string;
    workflowId: string;
}

const version = Constants.DesignerVersion;

export function getWebviewContent({ authorization, location, resourceGroupName, runId, subscriptionId, title, workflowId }: IGetWebviewContentOptions): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="img-src data: https:; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://ema.hosting.portal.azure.net/ema/Content/${version}/Html/styles/fabric.min.css">
    <link rel="stylesheet" href="https://ema.hosting.portal.azure.net/ema/Content/${version}/Html/styles/designer.min.css">
    <style>
        body {
            background-color: --vscode-editor-background;
            margin: 0;
            padding: 0;
        }
        body.light {
            background-color: #f2f2f2;
            margin-top: 4em;
        }
        .msla-container {
            margin-top: 52px;
        }
        #app {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 9;
        }
    </style>
    <title>${title}</title>
</head>
<body>
    <div id="app"></div>
    <div id="monitoring-view" class="msla-container"></div>
    <script src="https://ema.hosting.portal.azure.net/ema/Content/${version}/Scripts/logicappdesigner/require.min.js"></script>
    <script>
        (global => {
            "use strict";

            const $locale = "en";

            const baseUrl = "https://ema.hosting.portal.azure.net/ema/Content/${version}/Scripts/logicappdesigner/";
            global.publicPath = baseUrl;

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
                        "@fluentui/date-time-utilities/lib/dateMath/dateMath": "@fluentui/react",
                        "@fluentui/date-time-utilities/lib/dateValues/dateValues": "@fluentui/react",
                        "@fluentui/dom-utilities": "@fluentui/react",
                        "@fluentui/react/lib/common/DirectionalHint": "@fluentui/react",
                        "@fluentui/react/lib/ActivityItem": "@fluentui/react",
                        "@fluentui/react/lib/Announced": "@fluentui/react",
                        "@fluentui/react/lib/Autofill": "@fluentui/react",
                        "@fluentui/react/lib/Breadcrumb": "@fluentui/react",
                        "@fluentui/react/lib/Button": "@fluentui/react",
                        "@fluentui/react/lib/Calendar": "@fluentui/react",
                        "@fluentui/react/lib/Callout": "@fluentui/react",
                        "@fluentui/react/lib/Check": "@fluentui/react",
                        "@fluentui/react/lib/Checkbox": "@fluentui/react",
                        "@fluentui/react/lib/ChoiceGroup": "@fluentui/react",
                        "@fluentui/react/lib/Coachmark": "@fluentui/react",
                        "@fluentui/react/lib/Color": "@fluentui/react",
                        "@fluentui/react/lib/ColorPicker": "@fluentui/react",
                        "@fluentui/react/lib/ComboBox": "@fluentui/react",
                        "@fluentui/react/lib/CommandBar": "@fluentui/react",
                        "@fluentui/react/lib/ContextualMenu": "@fluentui/react",
                        "@fluentui/react/lib/DatePicker": "@fluentui/react",
                        "@fluentui/react/lib/DetailsList": "@fluentui/react",
                        "@fluentui/react/lib/Dialog": "@fluentui/react",
                        "@fluentui/react/lib/Divider": "@fluentui/react",
                        "@fluentui/react/lib/DocumentCard": "@fluentui/react",
                        "@fluentui/react/lib/Dropdown": "@fluentui/react",
                        "@fluentui/react/lib/ExtendedPicker": "@fluentui/react",
                        "@fluentui/react/lib/Fabric": "@fluentui/react",
                        "@fluentui/react/lib/Facepile": "@fluentui/react",
                        "@fluentui/react/lib/FloatingPicker": "@fluentui/react",
                        "@fluentui/react/lib/FocusTrapZone": "@fluentui/react",
                        "@fluentui/react/lib/FocusZone": "@fluentui/react",
                        "@fluentui/react/lib/Grid": "@fluentui/react",
                        "@fluentui/react/lib/GroupedList": "@fluentui/react",
                        "@fluentui/react/lib/HoverCard": "@fluentui/react",
                        "@fluentui/react/lib/Icon": "@fluentui/react",
                        "@fluentui/react/lib/Icons": "@fluentui/react",
                        "@fluentui/react/lib/Image": "@fluentui/react",
                        "@fluentui/react/lib/index": "@fluentui/react",
                        "@fluentui/react/lib/Keytip": "@fluentui/react",
                        "@fluentui/react/lib/KeytipData": "@fluentui/react",
                        "@fluentui/react/lib/KeytipLayer": "@fluentui/react",
                        "@fluentui/react/lib/Label": "@fluentui/react",
                        "@fluentui/react/lib/Layer": "@fluentui/react",
                        "@fluentui/react/lib/Link": "@fluentui/react",
                        "@fluentui/react/lib/List": "@fluentui/react",
                        "@fluentui/react/lib/MarqueeSelection": "@fluentui/react",
                        "@fluentui/react/lib/MessageBar": "@fluentui/react",
                        "@fluentui/react/lib/Modal": "@fluentui/react",
                        "@fluentui/react/lib/Nav": "@fluentui/react",
                        "@fluentui/react/lib/OverflowSet": "@fluentui/react",
                        "@fluentui/react/lib/Overlay": "@fluentui/react",
                        "@fluentui/react/lib/Panel": "@fluentui/react",
                        "@fluentui/react/lib/Persona": "@fluentui/react",
                        "@fluentui/react/lib/PersonaCoin": "@fluentui/react",
                        "@fluentui/react/lib/pickers": "@fluentui/react",
                        "@fluentui/react/lib/Pivot": "@fluentui/react",
                        "@fluentui/react/lib/Popup": "@fluentui/react",
                        "@fluentui/react/lib/ProgressIndicator": "@fluentui/react",
                        "@fluentui/react/lib/Rating": "@fluentui/react",
                        "@fluentui/react/lib/ResizeGroup": "@fluentui/react",
                        "@fluentui/react/lib/ScrollablePane": "@fluentui/react",
                        "@fluentui/react/lib/SearchBox": "@fluentui/react",
                        "@fluentui/react/lib/SelectableOption": "@fluentui/react",
                        "@fluentui/react/lib/SelectedItemsList": "@fluentui/react",
                        "@fluentui/react/lib/Selection": "@fluentui/react",
                        "@fluentui/react/lib/Separator": "@fluentui/react",
                        "@fluentui/react/lib/Shimmer": "@fluentui/react",
                        "@fluentui/react/lib/Slider": "@fluentui/react",
                        "@fluentui/react/lib/SpinButton": "@fluentui/react",
                        "@fluentui/react/lib/Spinner": "@fluentui/react",
                        "@fluentui/react/lib/Stack": "@fluentui/react",
                        "@fluentui/react/lib/Sticky": "@fluentui/react",
                        "@fluentui/react/lib/Styling": "@fluentui/react",
                        "@fluentui/react/lib/SwatchColorPicker": "@fluentui/react",
                        "@fluentui/react/lib/TeachingBubble": "@fluentui/react",
                        "@fluentui/react/lib/Text": "@fluentui/react",
                        "@fluentui/react/lib/TextField": "@fluentui/react",
                        "@fluentui/react/lib/ThemeGenerator": "@fluentui/react",
                        "@fluentui/react/lib/Toggle": "@fluentui/react",
                        "@fluentui/react/lib/Tooltip": "@fluentui/react",
                        "@fluentui/react/lib/Utilities": "@fluentui/react",
                        "@fluentui/react-focus": "@fluentui/react",
                        "@fluentui/react-window-provider": "@fluentui/react",
                        "@fluentui/theme/lib/colors/DefaultPalette": "@fluentui/react",
                        "@fluentui/theme/lib/createTheme": "@fluentui/react",
                        "@fluentui/theme/lib/effects/DefaultEffects": "@fluentui/react",
                        "@fluentui/theme/lib/fonts/DefaultFontStyles": "@fluentui/react",
                        "@fluentui/theme/lib/fonts/index": "@fluentui/react",
                        "@fluentui/theme/lib/motion/AnimationStyles": "@fluentui/react",
                        "office-ui-fabric-react/lib/common/DirectionalHint": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ActivityItem": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Announced": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Autofill": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Breadcrumb": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Button": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Calendar": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Callout": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Check": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Checkbox": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ChoiceGroup": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Coachmark": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ColorPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ComboBox": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/CommandBar": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ContextualMenu": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/DatePicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/DetailsList": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Dialog": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Divider": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/DocumentCard": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Dropdown": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ExtendedPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Fabric": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Facepile": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/FloatingPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/FocusTrapZone": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/FocusZone": "office-ui-fabric-react",
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
                        "office-ui-fabric-react/lib/pickers": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Pivot": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Popup": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ProgressIndicator": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Rating": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ResizeGroup": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ScrollablePane": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SearchBox": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SelectedItemsList": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Separator": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Shimmer": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Slider": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Spinner": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Stack": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Sticky": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Styling": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/SwatchColorPicker": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/TeachingBubble": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Text": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/TextField": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Theme": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/ThemeGenerator": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Toggle": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Tooltip": "office-ui-fabric-react",
                        "office-ui-fabric-react/lib/Utilities": "office-ui-fabric-react",
                        "reselect": "Reselect"
                    }
                },
                paths: {
                    "@fluentui/react": "fluentui-react.min",
                    "@microsoft/load-themed-styles": "@microsoft/load-themed-styles/lib-amd/index",
                    "@uifabric/icons/lib": "@uifabric/icons",
                    "@uifabric/merge-styles/lib": "@uifabric/merge-styles",
                    "@uifabric/styling/lib": "@uifabric/styling",
                    "@uifabric/utilities/lib": "@uifabric/utilities",
                    "core/main": "core.monitor.min",
                    "draft-js": "draft.min",
                    "fuse": "fuse.min",
                    "immutable": "immutable.min",
                    "localforage": "localforage.min",
                    "oauth": "../Workflow/OAuth/OAuthService",
                    "office-ui-fabric-react": "office-ui-fabric-react.min",
                    "prop-types": "prop-types.min",
                    "react": "react.production.min",
                    "react-dom": "react-dom.production.min",
                    "reselect": "reselect",
                    "re-reselect": "re-reselect",
                    "resources": getResourcePath(),
                    "SwaggerParser": "swagger-parser.min",
                    "tslib": "tslib"
                },
                shim: {
                    "@fluentui/react": {
                        deps: ["react", "react-dom", "tslib"],
                        exports: "FluentUIReact"
                    },
                    "office-ui-fabric-react": {
                        "deps": ["prop-types", "react", "react-dom", "tslib"],
                        "exports": "Fabric"
                    }
                },
                waitSeconds: 0
            });

            r(["react", "react-dom"], ( React, ReactDOM) => {
                global.React = React;
                global.ReactDOM = ReactDOM;

                r(["core/main", "oauth", "@fluentui/react"], (designercore, OAuth, { CommandBar, Fabric }) => {
                    designercore.requireScriptForEditor(\`\${baseUrl}/monaco/min/vs\`);

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

                    const oauthService = new OAuth.OAuthPopupService();

                    let monitor;
                    let flowConfigurationOptions;
                    const element = document.getElementById("monitoring-view");

                    function initialize(options, analyticsContextData) {
                        const iseSupported = !!options.featureFlags && !!options.featureFlags.enableintegrationserviceenvironment;

                        const config = {
                            apiOperationsPath: \`/providers/Microsoft.Web/locations/\${options.location}/apiOperations\`,
                            connectionsPath: "/providers/Microsoft.Web/connections",
                            connectionProvidersPath: \`/providers/Microsoft.Web/locations/\${options.location}/managedApis\`,
                            flowsPath: "/providers/Microsoft.Logic/workflows"
                        };

                        const urlService = new designercore.LogicAppsUrlService({
                            baseUrl: options.baseUrl,
                            config,
                            subscriptionId: options.subscriptionId,
                            resourceGroup: options.resourceGroup,
                            location: options.location,
                            integrationAccountId: options.integrationAccountId
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

                        const runInstanceServiceFactory = analytics => {
                            return new designercore.LogicAppsRunInstanceService({
                                analytics,
                                apiVersion: options.emaApiVersion,
                                baseUrl: options.baseUrl,
                                getAccessToken: getArmAccessToken,
                                locale: $locale
                            });
                        };

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
                                locale: $locale,
                                oauthService,
                                urlService
                            });
                        };

                        const getArmAccessToken = async () => {
                            return "${authorization}".substring("Bearer ".length);
                        };

                        const analyticsServiceFactory = version => {
                            const telemetryBaseUrl = options.telemetryBaseUrl || options.baseUrl;
                            const telemetryVersion = options.telemetryVersion || options.emaApiVersion;
                            const settings = {
                                analyticsServiceUri: \`\${telemetryBaseUrl}/providers/Internal.Telemetry/collect?api-version=\${telemetryVersion}\`,
                                getAccessToken: getArmAccessToken
                            };

                            const contextData = analyticsContextData || {};
                            contextData.host = window.location.host;
                            contextData.hostVersion = options.extensionVersion;
                            contextData.designerVersion = version;

                            const analyticsService = new designercore.AnalyticsService(settings, contextData);
                            analyticsService.startPublish();

                            return analyticsService;
                        };

                        const builtInTypeServiceFactory = (analytics, schemaVersion) => {
                            const options = {
                                openApiConnection: false,
                                showScopeActions: true,
                                showVariableActions: true,
                                httpManagedServiceIdentitySupported: true
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

                        const operationManifestServiceFactory = () => {
                            return new designercore.LogicAppsOperationManifestService();
                        };

                        const runServiceFactory = analytics => {
                            return new designercore.LogicAppsRunService({
                                analytics,
                                apiVersion: options.emaApiVersion,
                                baseUrl: options.baseUrl,
                                getAccessToken: getArmAccessToken,
                                getRuntimeToken: getArmAccessToken,
                                locale: $locale
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

                        flowConfigurationOptions = {
                            analyticsServiceFactory,
                            apiManagementServiceFactory,
                            apiVersion: options.emaApiVersion,
                            azureFunctionsApiVersion: options.azureFunctionApiVersion,
                            baseUrl: options.baseUrl,
                            batchApiVersion: options.batchApiVersion,
                            builtInTypeServiceFactory,
                            connectionGatewayApiVersion: options.connectionGatewayApiVersion,
                            connectionServiceFactory,
                            dynamicCallApiVersion: options.connectionApiVersion,
                            features: {
                                COLORIZE_MONITORING_INPUTS_OUTPUTS: true,
                                DEBOUNCE_EMIT_CHANGE: true,
                                ENABLE_ENVIRONMENT_BADGE: false, // TODO(joechung): Enable when ISE is supported in Visual Studio Code.
                                EXPRESSION_TRACE: true,
                                FX_TOKEN: true,
                                FX_TOKEN_FOR_CONDITION: true,
                                LOAD_RUN_ACTION_INPUTS_OUTPUTS_ASYNC: true,
                                SHOW_WEBHOOK_REQUEST_HISTORY: true,
                                SUPPORT_OBFUSCATION: true,
                                SUPPORT_PAN_AND_ZOOM: true,
                                USE_NEW_EXPRESSION_PARSER: true
                            },
                            functionServiceFactory,
                            getArmAccessToken: getArmAccessToken,
                            getRuntimeAccessToken: getArmAccessToken,
                            host: window.location.host,
                            hostEnvironment: designercore.Host.LogicApps,
                            hostServiceFactory,
                            hostVersion: options.extensionVersion,
                            identifier: "",
                            oauthService,
                            operationManifestServiceFactory,
                            runInstanceServiceFactory,
                            runServiceFactory,
                            startTelemetryPublish: true,
                            telemetryBaseUrl: options.telemetryBaseUrl,
                            telemetryVersion: options.telemetryVersion,
                            urlService,
                            workflowServiceFactory
                        };

                        monitor = window.monitor = new designercore.Monitor(flowConfigurationOptions, element);
                    }

                    (async () => {
                        function changeTheme() {
                            const { classList } = document.body;
                            const isInverted = classList.contains("vscode-dark");
                            const theme = isInverted ? "dark" : "light";
                            if (!classList.contains(theme)) {
                                classList.remove("dark", "light");
                                classList.add(theme);
                                monitor.changeTheme(theme);
                            }
                        }

                        async function renderMonitor(runId) {
                            disposeMonitor();
                            monitor = new designercore.Monitor(flowConfigurationOptions, element);
                            await monitor.loadRun(runId);
                            monitor.render();
                            changeTheme();

                            const callback = mutations => {
                                if (mutations.length > 0) {
                                    const mutation = mutations[0];
                                    if (mutation.target instanceof Element) {
                                        changeTheme();
                                    }
                                }
                            };
                            const observer = new MutationObserver(callback);
                            observer.observe(document.body, { attributeFilter: ["class"], attributes: true });
                        }

                        function disposeMonitor() {
                            if (monitor) {
                                ReactDOM.unmountComponentAtNode(element);
                                monitor = null;
                            }
                        }

                        function App() {
                            async function handleRefresh() {
                                await monitor.refreshRun();
                            }

                            const items = [
                                {
                                    key: "Refresh",
                                    ariaLabel: "Refresh",
                                    iconProps: {
                                        iconName: "Refresh"
                                    },
                                    name: "Refresh",
                                    onClick: handleRefresh
                                }
                            ];

                            return React.createElement(Fabric, null,
                                React.createElement(CommandBar, { items })
                            );
                        }

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
                                source: "vscodeMonitoringView"
                            }
                        };

                        await initialize(options, analyticsContextData);
                        await renderMonitor("${runId}");

                        ReactDOM.render(React.createElement(App), document.getElementById("app"));
                    })();
                });
            });
        })(window);
    </script>
</body>
</html>
`;
}
