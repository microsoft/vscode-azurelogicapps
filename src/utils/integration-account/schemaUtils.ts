/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntegrationAccountSchema } from "azure-arm-logic/lib/models";

export enum SchemaType {
    Xml = "Xml"
}

export async function createNewSchema(schemaName: string): Promise<IntegrationAccountSchema> {
    const schema: IntegrationAccountSchema = {
        content: "<?xml version='1.0'?>\n<xsd:schema xmlns:xsd='http://www.w3.org/2001/XMLSchema'>\n\t<xsd:element name='p' type='xsd:string'/>\n</xsd:schema>",
        contentType: "application/xml",
        name: schemaName,
        schemaType: SchemaType.Xml
    };

    return schema;
}
