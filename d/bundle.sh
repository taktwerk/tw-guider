cd android
sudo ./gradlew bundle
cd ../
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore '/media/cedric/DATEN/CLOUDS/taktwerk/11 Infrastruktur/05 DevEnv/Keys/taktwerk_upload_keystore.pkcs.jks' android/app/build/outputs/bundle/release/app-release.aab upload
cp android/app/build/outputs/bundle/release/app-release.aab app.aab