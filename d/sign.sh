jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore '/media/cedric/DATEN/CLOUDS/taktwerk/11 Infrastruktur/05 DevEnv/Keys/taktwerk_upload_keystore.pkcs.jks' platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk upload
rm platforms/android/app/build/outputs/apk/release/app-release-aligned.apk
$ANDROID_HOME/build-tools/29.0.3/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/app-release-aligned.apk

