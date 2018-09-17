/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntegrationAccountPartner } from "azure-arm-logic/lib/models";

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
