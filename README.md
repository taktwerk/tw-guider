## Setup
    
    npm install
    
then one of the ionic capacitor commands, eg:

    ionic cap run android
    
or our shortcuts:

    sh d/prod_cap.sh
    sh d/ios/prod_cap.sh

## Configuration

Configuration goes here

    src/environments/config.json
    src/environments/environment.ts
    local.properties

Translation files are in this folder

    src/assets/i18n

For productive build this file should be created

    environment.prod.ts

## HOW-TOs
### Changes in database

After changes to the database structure have been made in the code,
you need to increase the value of the property dbMigrationVersion in the file `src/environments/environment.ts`.

### How bring a new model offline to mobile client at the client side. On the example of `feedback` table.
1. Create model src/models/db/api/feedback-model.ts. Must inherit from class DbApiModel.
    - Add property TAG;
    - Add property apiPk (api primary key);
    - Add custom properties;
    - Add property UNIQUE_PAIR (optional) - expression to be used when creating the table if unique pairs are needed.
    - Add property TABLE_NAME;
    - Add property TABLE must be array of the follow item:
        0) column name;
        1) column type in db (SQLite Schema Type);
        2) column type in code - must be integer (see DbBaseModel static fields (DbBaseModel.TYPE_<x>)
        3) column name (in object) (optional)
    - Add property downloadMapping (must be type of FileMapInModel) (This is necessary if at least one file is present in the model)
        - property "name" - column name of the file name;
        - property "url" - column name of the file url;
        - property "localPath" - column name of the file local path;
        - property "thumbnail" (must be type of BaseFileMapInModel)(This is necessary if file have thumbnail):
            - property "name" - column name of the thumbnail name;
            - property "url" - column name of the thumbnail name;
            - property "localPath" - column name of the file local path;
    - add setUpdateCondition() method (optional) - to set the standard update condition for the model.
    - add beforePushDataToServer(isInsert?: boolean) method (optional) - execute some code before pushing data to server (example in protocol-default model);
    - add afterPushDataToServer(isInsert?: boolean) method (optional) - execute some code after pushing data to server (example in protocol-default model). Should return promise with additional models for pushing data to server;
    - each record in tables has a column _is_synced. If the column is 0, then this data is queued for uploading data to the server;
    - push occurs in turn for each model that is in the list allServicesBodiesForPush;
    - pushing is available after every saving or deleting model in device. _is_synced column is 0;
    - in model property 'idApi' is the equivalent of a column in a database on the server. ID column for id column in the server database. _id - local id in the application. Some models that have relationships have a link column with a local id (_id).

2. Create service src/providers/api/feedback-service.ts with name FeedbackService. Must inherit from class ApiService.
    - add property loadUrl - the part of the URL that will be used when sending model data to the server. (example of the push url: {base_url} + service.loadUrl + '/batch')
    - add property dbModelApi - must be type of model that uses the service;
    - add method newModel() to create a new model;
    - add to ApiSync construct feedbackService: FeedbackService.
    - add this service in apiServices list in ApiSync object (list of the model services for pulling data);
    - before pulling code check every service - is need to sync table rows or not;
    - sync API get all models with data for pulling;
    - code parse sync API response and write data in local database. Local and backend model property name should be the same;
    - if model data have file, this file is calling from server and upload to the device. Progress bar wait this file;
    - sync status and progress data is saving in auth table in additional_info column;
    - pulling is available after checking server data version via API `api/v1/sync/check-available-data`.
    - add this service in apiPushServices list in ApiSync object (list of the model services for pushing data to the server);
    - before pushing code check every service - is need to sync table rows or not.


3. File src/app/app.module.ts
    - add to providers `FeedbackService`

How to work with 3D models:
- model can be shown with `viewer-3d-model-component`;
- 3D model file should be gltf file.

How to implement model migration:
- create migration file in src/migrations directory with method execute() (should return promise);
- in src/migrations/base/migration-list export this migration file;
- add migration to the `migrations` array of the needed model;
- if model table is not exists, then this table will create via model properties and migrations realted to this model will not execute;
- all migrations will save in `migration` table. If migration is executed then `is_active` column is 1.

### Set up Sentry:
1) set sentryDsn in src/environments/environment.ts

### Set up PSPDFKIT (not needed now):
#### For android:
1) create file local.properties from local.properties.example and set up fields;
#### For iOS:
1) set pspdfkitIosLicenseKey in src/environments/environment.ts
2) create file scripts/cli_env.js from scripts/cli_env.js.example and set process.env.PSPDFKIT_IOS_COCOAPOD_KEY
3) ionic cordova platform add ios
4) ionic cordova prepare ios
5) If your application is targeting iOS versions prior to iOS 12.2 and your application does not already contain any Swift code, then you need to make sure Xcode bundles Swift standard libraries with your application distribution. To to so, open your target Build Settings and enable Always Embed Swift Standard Libraries.
6) Open platforms/ios/MyApp.xcworkspace in Xcode
7) If you followed the steps in our guide but still see an issue like this one:
   `dyld: Library not loaded: @rpath/PSPDFKit.framework/PSPDFKit
   Referenced from: /Users/username/Library/Developer/CoreSimulator/Devices/51AB3B8F-37EA-454E-B9B3-3FCE92F9FD56/data/Containers/Bundle/Application/6D84096F-4239-450C-A3E2-48820ACC42EE/product.app/product
   Reason: image not found`
   
   Then it’s likely you have an older Xcode project where the Runpath Search Paths in your project settings are not correctly configured. Make sure they are set to the following value: $(inherited) @executable_path/Frameworks @loader_path/Frameworks.

### Set DNS for using server via USB:
1) set usbHost in src/environments/environment.ts

## Known issues

During the development process associated with drawing on a PDF image, do not use the livereload command:
    
    ionic cordova run android -l

Just use:

    ionic cordova run android

## Workarounds

For Android platform:

The solution to the problem of pressing the "Back" button during the full-screen mode of the video tag.

in file platforms/android/app/src/main/java/com/taktwerk/twguider2/MainActivity.java add following code:

```
@Override
public void onBackPressed() {
    this.appView.loadUrl("javascript:if (document.webkitIsFullScreen === true) {document.webkitExitFullscreen();}");
}
```

## Migrations

- Add migration file to src/migrations directory;
- Add export of the migration to src/migrations/base/migration-list.ts file
- Add migration class name to related model property 'migrations';
- The migration class must contain an async "execute" method.
