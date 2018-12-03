/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { AgreementContent, BusinessIdentity, IntegrationAccountAgreement } from "azure-arm-logic/lib/models";
import { WebResource } from "ms-rest";
import * as request from "request-promise-native";
import { AgreementsDefaultContent } from "./default-content/agreementsDefaultContent";

export enum AgreementType {
    AS2 = "AS2",
    X12 = "X12",
    Edifact = "Edifact"
}

export async function createNewAgreement(agreementName: string,
                                         agreementType: AgreementType,
                                         hostPartner: string,
                                         hostIdentity: BusinessIdentity,
                                         guestPartner: string,
                                         guestIdentity: BusinessIdentity): Promise<IntegrationAccountAgreement> {
    let content: AgreementContent;
    switch (agreementType) {
        case AgreementType.AS2:
            content = {
                aS2: {
                    receiveAgreement: {
                        protocolSettings: AgreementsDefaultContent.defaultAs2ProtocolSettings,
                        receiverBusinessIdentity: hostIdentity,
                        senderBusinessIdentity: guestIdentity
                    },
                    sendAgreement: {
                        protocolSettings: AgreementsDefaultContent.defaultAs2ProtocolSettings,
                        receiverBusinessIdentity: guestIdentity,
                        senderBusinessIdentity: hostIdentity
                    }
                }
            };
            break;
        case AgreementType.X12:
            content = {
                x12: {
                    receiveAgreement: {
                        protocolSettings: AgreementsDefaultContent.defaultX12ProtocolSettings,
                        receiverBusinessIdentity: hostIdentity,
                        senderBusinessIdentity: guestIdentity
                    },
                    sendAgreement: {
                        protocolSettings: AgreementsDefaultContent.defaultX12ProtocolSettings,
                        receiverBusinessIdentity: guestIdentity,
                        senderBusinessIdentity: hostIdentity
                    }
                }
            };
            break;
        case AgreementType.Edifact:
        default:
            content = {
                edifact: {
                    receiveAgreement: {
                        protocolSettings: AgreementsDefaultContent.defaultEdifactProtocolSettings,
                        receiverBusinessIdentity: hostIdentity,
                        senderBusinessIdentity: guestIdentity
                    },
                    sendAgreement: {
                        protocolSettings: AgreementsDefaultContent.defaultEdifactProtocolSettings,
                        receiverBusinessIdentity: guestIdentity,
                        senderBusinessIdentity: hostIdentity
                    }
                }
            };
    }

    const agreement: IntegrationAccountAgreement = {
        agreementType,
        content,
        guestIdentity,
        guestPartner,
        hostIdentity,
        hostPartner,
        name: agreementName
    };

    return agreement;
}

export async function getAgreement(client: LogicAppsManagementClient, resourceGroupName: string, integrationAccountName: string, agreementName: string) {
    const authorization = await new Promise<string>((resolve, reject) => {
        const webResource = new WebResource();
        client.credentials.signRequest(webResource, (err: Error | undefined): void => {
            if (err) {
                reject(err);
            } else {
                resolve(webResource.headers.authorization);
            }
        });
    });

    const uri = `https://management.azure.com/subscriptions/${client.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Logic/integrationAccounts/${integrationAccountName}/agreements/${agreementName}?api-version=${this.client.apiVersion}`;
    const options: request.RequestPromiseOptions = {
        headers: {
            "Authorization": authorization,
            "Content-Type": "application/json"
        },
        method: "GET"
    };
    const response = await request(uri, options);
    return JSON.parse<IntegrationAccountAgreement>(response);
}