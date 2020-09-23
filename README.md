Execute follow commands from example:

    cp config.example.xml config.xml
(Add app id, author email, etc.)

    cp src/environments/environment.example.ts src/environments/environment.ts
(Configurate this file)

Configure this file
    `src/environments/config.json`

For Android platform:

The solution to the problem of pressing the "Back" button during the full-screen mode of the video tag.

in file platforms/android/app/src/main/java/com/taktwerk/twguider2/MainActivity.java add following code:

```
@Override
public void onBackPressed() {
    this.appView.loadUrl("javascript:if (document.webkitIsFullScreen === true) {document.webkitExitFullscreen();}");
}
```

## Set up project:
- npm install
- some ionic command (for example ionic cordova run android -l)

## Changes in database

After changes to the database structure have been made in the code,
you need to increase the value of the property dbMigrationVersion in the file `src/environments/environment.ts`.
(See an example in the file  `src/environments/environment.example.ts`)

## How bring a new model offline to mobile client at the client side. On the example of `feedback` table.
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

2. Create service src/providers/api/feedback-service.ts. Must inherit from class ApiService.
- add property loadUrl - the part of the URL that will be used when sending model data to the server. (example of the push url: {base_url} + service.loadUrl + '/batch')
- add property dbModelApi - must be type of model that uses the service;
- add method newModel() to create a new model.

3. File src/providers/api-sync.ts
- add to constructor service (in this case `feedbackService: FeedbackService`);
- add to apiServices object `feedback: this.feedbackService`;

4. File src/providers/api-push.ts
- add to constructor service (in this case `feedbackService: FeedbackService`);
- add to apiServices object `feedback: this.feedbackService`;

5. File src/app/app.module.ts
- add to providers `FeedbackService`

## Set up Sentry:
1) set sentryDsn in src/environments/environment.ts

## Set up PSPDFKIT (not needed now):
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

#### Set DNS for using server via USB:
1) set usbHost in src/environments/environment.ts


During the development process associated with drawing on a PDF image, do not use this liverload command:
ionic cordova run android -l
Use just:
ionic cordova run android

Translate files is consist in src/assets/i18n folder

For build shoud be created environment.prod.ts
