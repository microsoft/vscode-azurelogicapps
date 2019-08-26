/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

"use strict";

const path = require("path");

/** @type {import("webpack").Configuration} */
const config = {
    devtool: "source-map",
    entry: path.resolve(__dirname, "./src/extension.ts"),
    externals: {
        "azure-arm-logic": "commonjs azure-arm-logic",
        "fs-extra": "commonjs fs-extra",
        "glob": "commonjs glob",
        "js-yaml": "commonjs js-yaml",
        "ms-rest": "commonjs ms-rest",
        "request": "commonjs request",
        "request-promise-native": "commonjs request-promise-native",
        "vscode": "commonjs vscode",
        "vscode-azureextensionui": "commonjs vscode-azureextensionui",
        "vscode-extension-telemetry": "commonjs vscode-extension-telemetry",
        "vscode-nls": "commonjs vscode-nls"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(hostsrc|node_modules)/,
                loader: "ts-loader"
            }
        ]
    },
    output: {
        devtoolModuleFilenameTemplate: "../[resource-path]",
        filename: "extension.js",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, "out")
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    target: "node"
};

module.exports = config;
