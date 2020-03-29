import { AzureEnvironment } from "ms-rest-azure";
import { ServiceClientCredentials } from "ms-rest";
import { ILocationWizardContext, IResourceGroupWizardContext } from "vscode-azureextensionui";

export interface IWizardCredentials extends ServiceClientCredentials {
    environment?: AzureEnvironment;
}

export interface IWizardContext extends ILocationWizardContext, IResourceGroupWizardContext {
    credentials: IWizardCredentials;
}