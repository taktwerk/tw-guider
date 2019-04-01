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