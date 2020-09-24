cd platforms/android
./gradlew bundle
cd ../../
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore '/media/cedric/DATEN/CLOUDS/taktwerk/11 Infrastruktur/05 DevEnv/Keys/taktwerk_upload_keystore.pkcs.jks' platforms/android/app/build/outputs/bundle/release/app.aab upload
cp platforms/android/app/build/outputs/bundle/release/app.aab app.aab
