# taktwerk Guider 3

## Digital work instructions

_Platforms: Web, Android, iOS, MacOS, Windows, Linux_
_Framework: Flutter_

## Android

###  Upload Key Setup

Create a key with the following command. Don't define a personal password, as it needs to be stored plaintext in config file. You can use your own path.

    keytool -genkey -v -keystore ~/google-play-upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

Create a file `./android/key.properties` with the following content.

    storePassword=defined-password
    keyPassword=defined-password
    keyAlias=upload
    storeFile=/absolute/path/to/google-play-upload-keystore.jks

Reference:
https://docs.flutter.dev/deployment/android#sign-the-app

---  
###  Build

Build a bundle to upload into the store or an apk to deploy directly over file to device (development mode).

    flutter build appbundle --release --dart-define-from-file=.env/prod.json
    flutter build apk --release --dart-define-from-file=.env/prod.json

Or in Android Studio (Build > Flutter > ... )

---  
##  Troubleshoot

Use the following commands to troubleshoot run/build issues

    flutter clean
    flutter doctor
    
	cd android
	./gradlew assembleDebug --stacktrace
	./gradlew assembleRelease --stacktrace

---  

© [taktwerk.ch](https://taktwerk.ch) | 2012-2024

