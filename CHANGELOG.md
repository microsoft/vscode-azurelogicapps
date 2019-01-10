# Change Log
All notable changes to the "vscode-logicapps" extension will be documented in this file.

## [Unreleased]

## [0.1.4] - 2019-01-10
### Changed
- Update designer version to 1.40107.1.6

## [0.1.3] - 2018-12-14
### Changed
- Change read-only designer and monitoring view titles
- Update designer version to 1.31210.1.6

### Fixed
- #61 - Refresh Logic Apps before rendering in designer

## [0.1.2] - 2018-12-03
Thanks, Aaron Kunz (@DAXaholic), for contributing the new "Create Logic App" button!

### Added
- #33 - Add "Create Logic App" button to tree view
- View Logic App in read-only designer
- View Logic App run in monitoring view

## [0.1.1] - 2018-10-31
### Added
- #47 - Add parameter snippet

### Fixed
- #34 - Open editor after creating a Logic App
- #35 - Update README with minimum version requirement
- #43 - Fix "command 'azureLogicApps.createLogicApp' not found" error

## [0.1.0] - 2018-09-17
### Added
- Integration Accounts
  - Create, delete, and view properties
  - Maps
    - Create, delete, update, view map content, and view map properties
  - Partners
    - Create, delete, update, view partner content, and view partner properties
  - Schemas
    - Create, delete, update, view schema content, and view schema properties
- Logic Apps
  - Create, delete, update, and view Logic Apps
    - Open the Logic App in the Azure Management portal
  - Enable or disable Logic Apps
  - View Logic App runs and run action records
    - Resubmit the selected run
  - View Logic App triggers
    - Run Logic App using the selected trigger
  - View Logic App versions
    - Promote previous versions to current version
