# Azure Logic Apps for Visual Studio Code

[![Version](https://vsmarketplacebadge.apphb.com/version/ms-azuretools.vscode-logicapps.svg)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) [![Installs](https://vsmarketplacebadge.apphb.com/installs/ms-azuretools.vscode-logicapps.svg)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) [![Rating](https://vsmarketplacebadge.apphb.com/rating-star/ms-azuretools.vscode-logicapps.svg)](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps#review-details)

Azure Logic Apps simplifies how you build automated scalable workflows that integrate apps and data across cloud services and on-premises systems.

Use the Azure Logic Apps extension for VS Code to quickly create, debug, and manage Azure Logic Apps and Integration Accounts.

## Requirements

You must have Visual Studio Code 1.31.0 (January 2019) or later to install the extension.

All you need is an Azure Subscription to get started. If you don't have one, [click here](https://azure.microsoft.com/en-us/free/) for a free subscription.

## Features

* Browse, create, edit, and delete logic apps
* Browse and run logic apps triggers
* Browse and resubmit logic apps runs
* Browse and promote logic apps versions
* Browse, create, edit, and delete integration accounts, schema, map, partners, and agreements
* IntelliSense support helping you quickly and easily adding triggers, actions, and properties

* Create local logic apps project
* Add logic apps from explorer to local project
* Generate Azure resource manager deployment template for local project
* Generate Azure DevOps pipeline definition for local project

![Recurrence trigger IntelliSense](https://raw.githubusercontent.com/microsoft/vscode-azurelogicapps/main/resources/recurrence-trigger.gif)

![Run after IntelliSense](https://raw.githubusercontent.com/microsoft/vscode-azurelogicapps/main/resources/run-after.gif)

![Open in read-only designer](https://raw.githubusercontent.com/microsoft/vscode-azurelogicapps/main/resources/open-in-designer.gif)

![Open run in monitoring view](https://raw.githubusercontent.com/microsoft/vscode-azurelogicapps/main/resources/open-in-monitoring-view.gif)

## Recommended Extensions

We recommend installing the following VS Code extensions for a better experience when working with different integration account artifacts.

* For XSLT, install [XSLT Snippets](https://marketplace.visualstudio.com/items?itemName=marvinhagemeister.vscode-xslt-snippets)
* For Liquid, install [Shopify Liquid Template Snippets](https://marketplace.visualstudio.com/items?itemName=killalau.vscode-liquid-snippets)

## Managing Azure Subscriptions

If you are not signed in to Azure, you will see a "Sign in to Azure..." link. Alternatively, you can select "View->Command Palette" in the VS Code menu, and search for "Azure: Sign In".

If you don't have an Azure Account, you can sign up for one today for free and receive $200 in credits by selecting "Create a Free Azure Account..." or selecting "View->Command Palette" and searching for "Azure: Create an Account".

You may sign out of Azure by selecting "View->Command Palette" and searching for "Azure: Sign Out".

To select which subscriptions show up in the extension's explorer, click on the "Select Subscriptions..." button on any subscription node (indicated by a "filter" icon when you hover over it), or select "View->Command Palette" and search for "Azure: Select Subscriptions". Note that this selection affects all VS Code extensions that support the [Azure Account and Sign-In](https://github.com/Microsoft/vscode-azure-account) extension.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

VS Code collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://go.microsoft.com/fwlink/?LinkID=528096&clcid=0x409) to learn more. If you don’t wish to send usage data to Microsoft, you can set the `telemetry.enableTelemetry` setting to `false`. Learn more in our [FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).
