/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MessageItem } from "vscode";
import { localize } from "../localize";

export namespace DialogResponses {
    export const no: MessageItem = {
        title: localize("no", "No")
    };

    export const yes: MessageItem = {
        title: localize("yes", "Yes")
    };
}
