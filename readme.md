# taktwerk Guider

## Android
When compiling for android, first change the `config.xml` and change the the followings line.

    <plugin name="cordova-plugin-inappbrowser" spec="^3.0.0" />

to

    <plugin name="cordova-plugin-inappbrowser" spec="file:src/plugins/cordova-plugin-inappbrowser" />

### package.json

Change `package.json`

    "cordova-plugin-inappbrowser": "^3.0.0",

to

    "cordova-plugin-inappbrowser": "file:src/plugins/cordova-plugin-inappbrowser",

### package-lock.json

And lastly change `package-lock.json`

    "cordova-plugin-inappbrowser": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cordova-plugin-inappbrowser/-/cordova-plugin-inappbrowser-3.0.0.tgz",
      "integrity": "sha1-1K4A02Z2IQdRBXrSWK5K1KkWGto="
    },

to

    "cordova-plugin-inappbrowser": {
      "version": "file:./src/plugins/cordova-plugin-inappbrowser"
    },


## Compile Android

Compiling for android.

    $ ionic cordova build --release android

Copy `seafile\10 Projekte\02 Interne Projekte\2018 Guider\03 Entwicklung\02 App\Certificats\android\tw-guider.keystore` to `platform/android/build/outputs/apk/release`



Sign the unsigned APK

    $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tw-guider.keystore android-release-unsigned.apk tw-guider

Password: `pp0`

Zip-align the APK

    $ zipalign -v 4 android-release-unsigned.apk tw-guider.apk


Log in to [Google Play Console](https://play.google.com/apps/publish/?account=7025795242253286989#AppListPlace). `support@taktwerk.ch` `t4S`

Create a new release [Here](https://play.google.com/apps/publish/?account=7025795242253286989#ManageReleasesPlace:p=com.taktwerk.twguider&appid=4974548217126383153)
