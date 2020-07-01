/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureEnvironment } from "ms-rest-azure";
import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountPartner } from "azure-arm-logic/lib/models";
import { ServiceClientCredentials } from "ms-rest";
import { addExtensionUserAgent } from "vscode-azureextensionui";

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

export async function getAllPartners(credentials: IPartnerCredentials, subscriptionId: string, resourceGroup: string, integrationAccount: string): Promise<IntegrationAccountPartner[]> {
    const client = new LogicAppsManagementClient(credentials, subscriptionId, credentials.environment?.resourceManagerEndpointUrl);
    addExtensionUserAgent(client);

    const partners = await client.integrationAccountPartners.list(resourceGroup, integrationAccount);
    let nextPageLink = partners.nextLink;

    while (nextPageLink) {
        partners.push(...await client.integrationAccountPartners.listNext(nextPageLink));
        nextPageLink = partners.nextLink;
    }

    return partners;
}

export interface IPartnerCredentials extends ServiceClientCredentials {
    environment?: AzureEnvironment;
}
