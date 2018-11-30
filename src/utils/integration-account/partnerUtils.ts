/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import { addExtensionUserAgent } from "vscode-azureextensionui";
import { ServiceClientCredentials } from "ms-rest";

export enum PartnerType {
    B2B = "B2B"
}

export async function createNewPartner(partnerName: string, qualifier: string, value: string): Promise<IntegrationAccountPartner> {
    const partner: IntegrationAccountPartner = {
        content: {
            b2b: {
                businessIdentities: [
                    {
                        qualifier,
                        value
                    }
                ]
            }
        },
        name: partnerName,
        partnerType: PartnerType.B2B
    };

    return partner;
}

export async function getAllPartners(credentials: ServiceClientCredentials, subscriptionId: string, resourceGroup: string, integrationAccount: string): Promise<IntegrationAccountPartner[]> {
    const client = new LogicAppsManagementClient(credentials, subscriptionId);
    addExtensionUserAgent(client);

    const partners = await client.integrationAccountPartners.list(resourceGroup, integrationAccount);
    let nextPageLink = partners.nextLink;

    while (nextPageLink) {
        partners.concat(await client.integrationAccountPartners.listNext(nextPageLink));
        nextPageLink = partners.nextLink;
    }

    return partners;
}