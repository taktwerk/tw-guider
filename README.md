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
