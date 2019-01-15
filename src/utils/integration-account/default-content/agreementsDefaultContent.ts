/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AS2ProtocolSettings, EdifactProtocolSettings, X12ProtocolSettings } from "azure-arm-logic/lib/models";
import { Constants } from "../../../constants";

export class AgreementsDefaultContent {
    public static defaultAs2ProtocolSettings: AS2ProtocolSettings = {
        acknowledgementConnectionSettings: {
            ignoreCertificateNameMismatch: false,
            keepHttpConnectionAlive: false,
            supportHttpStatusCodeContinue: false,
            unfoldHttpHeaders: false
        },
        envelopeSettings: {
            autogenerateFileName: false,
            fileNameTemplate: "%FILE().ReceivedFileName%",
            messageContentType: Constants.TextContentType,
            suspendMessageOnFileNameGenerationError: true,
            transmitFileNameInMimeHeader: false
        },
        errorSettings: {
            resendIfMDNNotReceived: false,
            suspendDuplicateMessage: false
        },
        mdnSettings: {
            dispositionNotificationTo: "http://localhost",
            micHashingAlgorithm: "SHA1",
            needMDN: false,
            sendInboundMDNToMessageBox: true,
            sendMDNAsynchronously: false,
            signMDN: false,
            signOutboundMDNIfOptional: false
        },
        messageConnectionSettings: {
            ignoreCertificateNameMismatch: false,
            keepHttpConnectionAlive: true,
            supportHttpStatusCodeContinue: true,
            unfoldHttpHeaders: true
        },
        securitySettings: {
            enableNRRForInboundDecodedMessages: false,
            enableNRRForInboundEncodedMessages: false,
            enableNRRForInboundMDN: false,
            enableNRRForOutboundDecodedMessages: false,
            enableNRRForOutboundEncodedMessages: false,
            enableNRRForOutboundMDN: false,
            overrideGroupSigningCertificate: false,
        },
        validationSettings: {
            checkCertificateRevocationListOnReceive: false,
            checkCertificateRevocationListOnSend: false,
            checkDuplicateMessage: false,
            compressMessage: false,
            encryptMessage: false,
            encryptionAlgorithm: "DES3",
            interchangeDuplicatesValidityDays: 5,
            overrideMessageProperties: false,
            signMessage: false,
            signingAlgorithm: "Default"
        }
    };

    public static defaultX12ProtocolSettings: X12ProtocolSettings = {
        acknowledgementSettings: {
            acknowledgementControlNumberLowerBound: 1,
            acknowledgementControlNumberUpperBound: 999999999,
            batchFunctionalAcknowledgements: true,
            batchImplementationAcknowledgements: false,
            batchTechnicalAcknowledgements: true,
            functionalAcknowledgementVersion: "00401",
            needFunctionalAcknowledgement: false,
            needImplementationAcknowledgement: false,
            needLoopForValidMessages: false,
            needTechnicalAcknowledgement: false,
            rolloverAcknowledgementControlNumber: true,
            sendSynchronousAcknowledgement: true
        },
        envelopeOverrides: [],
        envelopeSettings: {
            controlStandardsId: 85,
            controlVersionNumber: "00401",
            enableDefaultGroupHeaders: true,
            groupControlNumberLowerBound: 1,
            groupControlNumberUpperBound: 999999999,
            groupHeaderAgencyCode: "T",
            groupHeaderDateFormat: "CCYYMMDD",
            groupHeaderTimeFormat: "HHMM",
            groupHeaderVersion: "00401",
            interchangeControlNumberLowerBound: 1,
            interchangeControlNumberUpperBound: 999999999,
            overwriteExistingTransactionSetControlNumber: true,
            receiverApplicationId: "RECEIVE-APP",
            rolloverGroupControlNumber: true,
            rolloverInterchangeControlNumber: true,
            rolloverTransactionSetControlNumber: true,
            senderApplicationId: "BTS-SENDER",
            transactionSetControlNumberLowerBound: 1,
            transactionSetControlNumberUpperBound: 999999999,
            usageIndicator: "Test",
            useControlStandardsIdAsRepetitionCharacter: false
        },
        framingSettings: {
            characterSet: "UTF8",
            componentSeparator: 58,
            dataElementSeparator: 42,
            replaceCharacter: 36,
            replaceSeparatorsInPayload: false,
            segmentTerminator: 126,
            segmentTerminatorSuffix: "None"
        },
        messageFilter: {
            messageFilterType: "Exclude"
        },
        messageFilterList: [],
        processingSettings: {
            convertImpliedDecimal: false,
            createEmptyXmlTagsForTrailingSeparators: true,
            maskSecurityInfo: true,
            preserveInterchange: false,
            suspendInterchangeOnError: false,
            useDotAsDecimalSeparator: false
        },
        schemaReferences: [],
        securitySettings: {
            authorizationQualifier: "00",
            securityQualifier: "00"
        },
        validationOverrides: [],
        validationSettings: {
            allowLeadingAndTrailingSpacesAndZeroes: false,
            checkDuplicateGroupControlNumber: false,
            checkDuplicateInterchangeControlNumber: false,
            checkDuplicateTransactionSetControlNumber: false,
            interchangeControlNumberValidityDays: 30,
            trailingSeparatorPolicy: "NotAllowed",
            trimLeadingAndTrailingSpacesAndZeroes: false,
            validateCharacterSet: true,
            validateEDITypes: true,
            validateXSDTypes: false
        },
        x12DelimiterOverrides: []
    };

    public static defaultEdifactProtocolSettings: EdifactProtocolSettings = {
        acknowledgementSettings: {
            acknowledgementControlNumberLowerBound: 1,
            acknowledgementControlNumberUpperBound: 999999999,
            batchFunctionalAcknowledgements: true,
            batchTechnicalAcknowledgements: true,
            needFunctionalAcknowledgement: false,
            needLoopForValidMessages: false,
            needTechnicalAcknowledgement: false,
            rolloverAcknowledgementControlNumber: true,
            sendSynchronousAcknowledgement: true
        },
        edifactDelimiterOverrides: [],
        envelopeOverrides: [],
        envelopeSettings: {
            applyDelimiterStringAdvice: false,
            createGroupingSegments: false,
            enableDefaultGroupHeaders: true,
            groupControlNumberLowerBound: 1,
            groupControlNumberUpperBound: 999999999,
            interchangeControlNumberLowerBound: 1,
            interchangeControlNumberUpperBound: 999999999,
            isTestInterchange: false,
            overwriteExistingTransactionSetControlNumber: true,
            rolloverGroupControlNumber: true,
            rolloverInterchangeControlNumber: true,
            rolloverTransactionSetControlNumber: true,
            transactionSetControlNumberLowerBound: 1,
            transactionSetControlNumberUpperBound: 999999999
        },
        framingSettings: {
            characterSet: "UNOB",
            componentSeparator: 58,
            dataElementSeparator: 43,
            decimalPointIndicator: "Comma",
            protocolVersion: 3,
            releaseIndicator: 63,
            repetitionSeparator: 42,
            segmentTerminator: 39,
            segmentTerminatorSuffix: "None"
        },
        messageFilter: {
            messageFilterType: "Exclude"
        },
        messageFilterList: [],
        processingSettings: {
            createEmptyXmlTagsForTrailingSeparators: true,
            maskSecurityInfo: true,
            preserveInterchange: false,
            suspendInterchangeOnError: false,
            useDotAsDecimalSeparator: false
        },
        schemaReferences: [],
        validationOverrides: [],
        validationSettings: {
            allowLeadingAndTrailingSpacesAndZeroes: false,
            checkDuplicateGroupControlNumber: false,
            checkDuplicateInterchangeControlNumber: false,
            checkDuplicateTransactionSetControlNumber: false,
            interchangeControlNumberValidityDays: 30,
            trailingSeparatorPolicy: "NotAllowed",
            trimLeadingAndTrailingSpacesAndZeroes: false,
            validateCharacterSet: true,
            validateEDITypes: true,
            validateXSDTypes: false
        }
    };
}
