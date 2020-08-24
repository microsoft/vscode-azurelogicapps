/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import LogicAppsManagementClient from "azure-arm-logic";
import { IntegrationAccountAgreement } from "azure-arm-logic/lib/models";
import { IAzureTreeItem } from "vscode-azureextensionui";
import { AgreementType } from "../../utils/integration-account/agreementUtils";
import { getIconPath } from "../../utils/nodeUtils";

export class IntegrationAccountAgreementTreeItem implements IAzureTreeItem {
    public static readonly contextValue = "azIntegrationAccountAgreement";
    public readonly contextValue = IntegrationAccountAgreementTreeItem.contextValue;

    public constructor(private readonly client: LogicAppsManagementClient, private integrationAccountAgreement: IntegrationAccountAgreement) {
    }

    public get commandId(): string {
        return "azIntegrationAccounts.openAgreementInEditor";
    }

    public async deleteTreeItem(): Promise<void> {
        await this.client.integrationAccountAgreements.deleteMethod(this.resourceGroupName, this.integrationAccountName, this.label);
    }

    public get iconPath(): string {
        return getIconPath(IntegrationAccountAgreementTreeItem.contextValue);
    }

    public get id(): string {
        return this.integrationAccountAgreement.id!;
    }

    public get label(): string {
        return this.integrationAccountAgreement.name!;
    }

    public get resourceGroupName(): string {
        return this.integrationAccountAgreement.id!.split("/").slice(-7, -6)[0];
    }

    public get integrationAccountAgreementName(): string {
        return this.integrationAccountAgreement.name!;
    }

    public get integrationAccountName(): string {
        return this.integrationAccountAgreement.id!.split("/").slice(-3, -2)[0];
    }

    public get agreementType(): AgreementType {
        return (AgreementType as any)[this.integrationAccountAgreement.agreementType];
    }

    public async getContent(): Promise<string> {
        this.integrationAccountAgreement = await this.client.integrationAccountAgreements.get(this.resourceGroupName, this.integrationAccountName, this.integrationAccountAgreementName);

        return JSON.stringify(this.integrationAccountAgreement, null, 4);
    }

    public async getProperties(refresh = false): Promise<string> {
        if (refresh) {
            this.integrationAccountAgreement = await this.client.integrationAccountAgreements.get(this.resourceGroupName, this.integrationAccountName, this.integrationAccountAgreementName);
        }

        // Only want the high level properties, not the whole content
        const integrationAccountAgreement: Record<string, any> = { ...this.integrationAccountAgreement };
        delete integrationAccountAgreement.content;

        return JSON.stringify(integrationAccountAgreement, null, 4);
    }

    public async update(agreementContent: string): Promise<string> {
        const agreement: IntegrationAccountAgreement = JSON.parse(agreementContent);

        const updatedAgreement = await this.client.integrationAccountAgreements.createOrUpdate(this.resourceGroupName, this.integrationAccountName, this.integrationAccountAgreementName, agreement);
        return JSON.stringify(updatedAgreement, null, 4);
    }
}
