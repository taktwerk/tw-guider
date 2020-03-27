var exec = require('child_process').exec, child;

module.exports = function(ctx) {
    exec('cp local.properties platforms/android/local.properties', function (error, stdout, stderr) {
        console.log('child 44444');
    });
};
