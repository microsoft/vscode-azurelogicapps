/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from "path";
import * as vscode from "vscode";
import { Constants } from "../../constants";
import { ext } from "../../extensionVariables";

interface IGetWebviewContentOptions {
    apiVersion: string;
    baseUrl: string;
    hostScriptPath: string;
    runId: string;
    title: string;
    workflowId: string;
}

const version = Constants.DesignerVersion;

export function getHostScriptPath(webview: vscode.Webview): string {
    return webview.asWebviewUri(vscode.Uri.file(path.join(ext.context.extensionPath, "out", "host"))).toString();
}

export function getWebviewContent({ apiVersion, baseUrl, hostScriptPath, runId, title, workflowId }: IGetWebviewContentOptions): string {
    const markup = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="img-src data: https:; script-src https: vscode-resource: 'unsafe-eval' 'unsafe-inline'; style-src https: 'unsafe-inline';">
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

            const vscode = acquireVsCodeApi();

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
                    "core/main": "core.monitor.min",
                    "draft-js": "draft.min",
                    "fuse": "fuse.min",
                    "host": "${hostScriptPath}",
                    "immutable": "immutable.min",
                    "localforage": "localforage.min",
                    "office-ui-fabric-react": "office-ui-fabric-react.min",
                    "prop-types": "prop-types.min",
                    "react": "react.production.min",
                    "react-dom": "react-dom.production.min",
                    "Reselect": "reselect",
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
                },
                waitSeconds: 0
            });

            r(["react", "react-dom"], (React, ReactDOM) => {
                global.React = React;
                global.ReactDOM = ReactDOM;

                r(["draft-js"], Draft => {
                    global.Draft = Draft;

                    r(["core/main", "host", "office-ui-fabric-react"], (designercore, { AnalyticsService, BuiltInTypeService, ConnectionService, ConnectorService, HostService, OAuthService, OperationManifestService, RunInstanceService, RunService, UrlService, WorkflowService }, { CommandBar, Fabric }) => {
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

                        const getArmAccessToken = async () => {
                            return "";
                        };

                        const oauthService = new OAuthService();

                        let monitor;
                        let flowConfigurationOptions;
                        const element = document.getElementById("monitoring-view");

                        function initialize(options, analyticsContextData) {
                            const iseSupported = false;

                            const analyticsServiceFactory = () => {
                                return new AnalyticsService({
                                    postMessage(log) {
                                        return vscode.postMessage({
                                            command: "Analytics",
                                            log
                                        });
                                    }
                                });
                            }
    
                            const builtInTypeServiceFactory = (_, schemaVersion) => {
                                const options = {
                                    httpManagedServiceIdentitySupported: true,
                                    openApiConnection: false,
                                    showScopeActions: true,
                                    showVariableActions: true
                                };
                                const builtInTypeService = new designercore.LogicAppsBuiltInTypeService(schemaVersion, options);

                                return new BuiltInTypeService(schemaVersion, {
                                    builtInTypeService
                                });
                            };

                            const connectionServiceFactory = () => {
                                return new ConnectionService({
                                    apiVersion: "${apiVersion}",
                                    baseUrl: "${baseUrl}",
                                    oauthService
                                });
                            };

                            const connectorServiceFactory = () => {
                                return new ConnectorService({
                                    apiVersion: "${apiVersion}"
                                });
                            };

                            const hostServiceFactory = () => {
                                return new HostService({
                                    postMessage: vscode.postMessage
                                });
                            };

                            const operationManifestServiceFactory = () => {
                                const operationManifestService = new designercore.LogicAppsOperationManifestService();

                                return new OperationManifestService({
                                    operationManifestService
                                });
                            };

                            const runInstanceServiceFactory = () => {
                                return new RunInstanceService({
                                    apiVersion: "${apiVersion}",
                                    baseUrl: "${baseUrl}"
                                });
                            };

                            const runServiceFactory = () => {
                                return new RunService({
                                    apiVersion: "${apiVersion}",
                                    baseUrl: "${baseUrl}"
                                });
                            };

                            const urlService = new UrlService();

                            const workflowServiceFactory = () => {
                                return new WorkflowService({
                                    apiVersion: "${apiVersion}",
                                    baseUrl: "${baseUrl}"
                                });
                            };

                            flowConfigurationOptions = {
                                analyticsServiceFactory,
                                apiVersion: options.emaApiVersion,
                                azureFunctionsApiVersion: "unused",
                                baseUrl: options.baseUrl,
                                batchApiVersion: options.batchApiVersion,
                                builtInTypeServiceFactory,
                                connectionGatewayApiVersion: options.connectionGatewayApiVersion,
                                connectionServiceFactory,
                                connectorServiceFactory,
                                dynamicCallApiVersion: options.connectionApiVersion,
                                features: {
                                    COLORIZE_MONITORING_INPUTS_OUTPUTS: true,
                                    DEBOUNCE_EMIT_CHANGE: true,
                                    EXPRESSION_TRACE: true,
                                    FX_TOKEN: true,
                                    FX_TOKEN_FOR_CONDITION: true,
                                    LOAD_RUN_ACTION_INPUTS_OUTPUTS_ASYNC: true,
                                    SHOW_WEBHOOK_REQUEST_HISTORY: true,
                                    SUPPORT_OBFUSCATION: true,
                                    SUPPORT_PAN_AND_ZOOM: true,
                                    USE_NEW_EXPRESSION_PARSER: true
                                },
                                getArmAccessToken,
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
                                location: "unused",
                                resourceGroup: "unused",
                                subscriptionId: "unused",
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
            });
        })(window);
    </script>
</body>
</html>
`;

    return markup;
}
