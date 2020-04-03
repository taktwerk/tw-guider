var exec = require('child_process').exec, child;

module.exports = function(ctx) {
    return new Promise(async resolve => {
        exec('ionic cordova plugin add https://github.com/PSPDFKit/PSPDFKit-Cordova.git --force', function (error, stdout, stderr) {
            console.log('add plugin pspdfkit-cordova')
            exec('ionic cordova plugin add https://github.com/moust/cordova-plugin-videoplayer.git --no-save', function (error, stdout, stderr) {
                console.log('add plugin com.moust.cordova.videoplayer')
                resolve(true);
            });
        });
    }).then(msWaited => {});
};

