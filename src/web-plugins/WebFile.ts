const fs = require('fs');
const path = require('path');

export default class WebFile {
    dataDirectory: 'assets/';

    checkFile = (directory, name) => {
        return new Promise((resolve, reject) => {
            const filepath = directory + path.sep + name;
            try {
                if (fs.existsSync(filepath)) {
                    resolve(filepath);
                }
            } catch(err) {
                reject(false);
            }
        });
    }
}