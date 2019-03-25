/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Replace characters invalid for a deployment template parameter name with a replacement character (default _).
 * Deployment template parameter names cannot begin with a number.
 * @param {string} value
 * @param {string} [replaceWith="_"]
 * @returns {string}
 */
export function normalizeParameterName(value: string, replaceWith: string = "_"): string {
    return value.replace(/[^$\w]/g, replaceWith).replace(/^\d/, replaceWith);
}

/**
 * Replace characters invalid for an Azure resource name with a replacement character (default _).
 * Azure resource names cannot end with a period.
 * @param {string} value
 * @param {string} [replaceWith="_"]
 * @returns {string}
 */
export function normalizeResourceName(value: string, replaceWith: string = "_"): string {
    return value.replace(/[^-\w.()]/g, replaceWith).replace(/\.$/, replaceWith);
}
