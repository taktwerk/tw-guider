Execute follow commands from example:

    cp config.example.xml config.xml
(Add app id, author email, etc.)

    cp src/environments/environment.example.ts src/environments/environment.ts
(Configurate this file)

    cp resources/android/xml/network_security_config.example.xml resources/android/xml/network_security_config.xml
Add in created file subdomains (includeSubdomains)

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
- add file local.properties from local.properties.example
- npm run-script taktwerk
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

SENTRY:
- add to environment sentryDsn: '{SENTRY_DSN}'
- If you want to skip the automatic release version and set the release completely for yourself. You have to add this env var to disable it e.g.:
    - SENTRY_SKIP_AUTO_RELEASE=true ionic cordova run android -l
