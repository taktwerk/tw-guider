var exec = require('child_process').exec, child;

module.exports = function(ctx) {
    return new Promise(async resolve => {
        exec('cordova plugin add https://github.com/PSPDFKit/PSPDFKit-Cordova.git --force', function (error, stdout, stderr) {
            console.log('add plugin pspdfkit-cordova');
            exec('ionic cordova plugin add https://github.com/moust/cordova-plugin-videoplayer.git --no-save', function (error, stdout, stderr) {
                console.log('add plugin com.moust.cordova.videoplayer');
		const cocoaPodsKey = process.env.PSPDFKIT_IOS_COCOAPOD_KEY;
		const command = `sed -i '' 's/YOUR_COCOAPODS_KEY_GOES_HERE/${cocoaPodsKey}/g' plugins/pspdfkit-cordova/plugin.xml`;
		console.log(command);
                exec(command, function (error, stdout, stderr) {
		    setTimeout(() => {
			console.log('change pod key for pspdfkit plugin');
			resolve(true);
		    }, 1000);	
                });
            });
        });
    }).then(msWaited => {});
};

