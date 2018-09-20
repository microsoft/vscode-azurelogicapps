/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntegrationAccountMap } from "azure-arm-logic/lib/models";

export enum MapType {
    Liquid = "Liquid",
    Xslt = "Xslt",
    Xslt20 = "Xslt20",
    Xslt30 = "Xslt30"
}

export function getContentType(mapType: MapType): string {
    return mapType === MapType.Liquid ? "text/plain" : "application/xml";
}

export async function createNewMap(mapName: string, mapType: MapType): Promise<IntegrationAccountMap> {
    let content: string;
    switch (mapType) {
        case MapType.Liquid:
            content = "{% if user %}\nHello {{ user.name }}\n{% endif %}";
            break;
        case MapType.Xslt30:
            content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xsl:stylesheet version=\"3.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">\n\t<xsl:template match=\"/\">\n\n\t</xsl:template>\n</xsl:stylesheet>";
            break;
        case MapType.Xslt20:
            content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xsl:stylesheet version=\"2.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">\n\t<xsl:template match=\"/\">\n\n\t</xsl:template>\n</xsl:stylesheet>";
            break;
        case MapType.Xslt:
        default:
            content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">\n\t<xsl:template match=\"/\">\n\n\t</xsl:template>\n</xsl:stylesheet>";
    }

    const map: IntegrationAccountMap = {
        content,
        contentType: getContentType(mapType),
        mapType,
        name: mapName
    };

    return map;
}
