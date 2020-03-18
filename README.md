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

Install PSPDFKit

ionic cordova plugin add https://github.com/PSPDFKit/PSPDFKit-Cordova.git --force

Create file platforms/android/local.properties and add next:
pspdfkit.password=YOUR_PASSWORD
pspdfkit.license=LICENSE_STRING


Add PDFTron NativeViewer
### Android

1. Add your PDFTron license key to `MyApp/platforms/android/gradle.properties` file.

    ```
    android.useAndroidX=true
    android.enableJetifier=true
    PDFTRON_LICENSE_KEY=INSERT_COMMERCIAL_LICENSE_KEY_HERE_AFTER_PURCHASE (empty for trial)
    ```

2. Open `MyApp/platforms/android/app/src/main/java/com/example/myapp/MainActivity.java`, and change the base class to `CordovaAppCompatActivity`:

    ```diff
    -public class MainActivity extends CordovaActivity {
    +public class MainActivity extends CordovaAppCompatActivity {
    }
    ```

3. Open `MyApp/platforms/android/app/src/main/AndroidManifest.xml`, and change theme of `MainActivity` to `@style/CustomAppTheme`:

    ```diff
    -<activity android:name="MainActivity" android:theme="@android:style/Theme.DeviceDefault.NoActionBar" >
    +<activity android:name="MainActivity" android:theme="@style/CustomAppTheme" >
    ```

4. After the changes, you will need to call the following to build and run the project:

    First, in `MyApp` directory call:

    ```bash
    cordova build android
    ```

    Then import the `MyApp/platforms/android` folder into Android Studio, and run the project from Android Studio using the play button. You will see a message that says `No Java files found that extend CordovaActivity.` . This message is okay to ignore since we're using CordovaAppCompatActivity.

    **Note:**
    When the project is first imported, Android Studio will complain about the minSdk. To resolve this, click `Move minSdkVersion to build files and sync project` in the error window.
