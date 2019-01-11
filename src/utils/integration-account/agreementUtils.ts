/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AgreementContent, BusinessIdentity, IntegrationAccountAgreement } from "azure-arm-logic/lib/models";
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
