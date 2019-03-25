/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SubscriptionClient } from "azure-arm-resource";
import * as vscode from "vscode";

export async function askForLocation(): Promise<any | undefined> {
    return vscode.window.showQuickPick(getLocations(), { canPickMany: false });
}

async function getLocations(): Promise<string[]> {
    const extension = vscode.extensions.getExtension("ms-vscode.azure-account");
    if (!extension) {
        return [];
    }

    const { filters, sessions } = extension.exports;
    if (filters.length < 1 || sessions.length < 1) {
        return [];
    }

    const { subscriptionId } = filters[0].subscription;
    const { credentials } = sessions[0];
    const client = new SubscriptionClient(credentials);
    const locationListResult = await client.subscriptions.listLocations(subscriptionId);
    const locations = locationListResult.map((location) => location!.displayName!);
    locations.sort();

    return locations;
}
