/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntegrationAccount } from "azure-arm-logic/lib/models";

export enum IntegrationAccountSku {
    Free = "Free",
    Basic = "Basic",
    Standard = "Standard"
}

export async function createNewIntegrationAccount(integrationAccountName: string, sku: IntegrationAccountSku, location: string): Promise<IntegrationAccount> {
    const integrationAccount: IntegrationAccount = {
        location,
        name: integrationAccountName,
        properties: {},
        sku: {
            name: sku
        }
    };

    return integrationAccount;
}
