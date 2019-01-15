/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from "path";
import { ext } from "../extensionVariables";

export interface IThemedIconPath {
    dark: string;
    light: string;
}

export function getIconPath(iconName: string): string {
    return ext.context.asAbsolutePath(path.join("resources", `${iconName}.svg`));
}

export function getStatusIconPath(iconName: string): string {
    return ext.context.asAbsolutePath(path.join("resources", "status", `${iconName}.svg`));
}

export function getThemedIconPath(iconName: string): IThemedIconPath {
    return {
        dark: ext.context.asAbsolutePath(path.join("resources", "dark", `${iconName}.svg`)),
        light: ext.context.asAbsolutePath(path.join("resources", "light", `${iconName}.svg`))
    };
}

export function arrayToMap<T, K extends keyof T>(array: T[], key: K): Map<string, T> {
    const mappedObjects: Map<string, T> = new Map();
    for (const item of array) {
        mappedObjects.set(item[key].toString(), item);
    }

    return mappedObjects;
}
