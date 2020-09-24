var exec = require('child_process').exec, child;

module.exports = function(ctx) {
    return new Promise(async resolve => {
        exec('ionic cordova plugin add https://github.com/moust/cordova-plugin-videoplayer.git --no-save', function (error, stdout, stderr) {
            console.log('add plugin com.moust.cordova.videoplayer');
        });
    }).then(msWaited => {});
};

