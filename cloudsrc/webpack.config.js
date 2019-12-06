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
    entry: path.resolve(__dirname, "./index.ts"),
    mode: "development",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            }
        ]
    },
    output: {
        filename: "cloud.js",
        library: "cloud",
        libraryTarget: "amd",
        path: path.resolve(__dirname, "../out")
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
};

module.exports = config;
