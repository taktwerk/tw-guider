console.log('BEFORREEEEEEEE PLATRORM ADDDDDDD');

var exec = require('child_process').exec, child;

module.exports = function(ctx) {
    exec('ionic cordova plugin add https://github.com/PSPDFKit/PSPDFKit-Cordova.git --force', function (error, stdout, stderr) {
        console.log('child 55555555555555555');
    });
    exec('ionic cordova plugin add https://github.com/moust/cordova-plugin-videoplayer.git --no-save', function (error, stdout, stderr) {
        console.log('child 6666666666666666666666666');
    });
};
