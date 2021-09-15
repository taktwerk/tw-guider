import * as fs from 'fs';
import * as path from 'path';

export default class WebFile {
   public dataDirectory = 'assets/locallist/';

    checkFile = (directory, name) => {
        return new Promise((resolve, reject) => {
            const filepath = directory + path.sep + name;
            try {
                if (fs.existsSync(filepath)) {
                    resolve(filepath);
                }
            } catch (err) {
                reject(false);
            }
        });
    }

    checkDir = () => {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(this.dataDirectory)) {
                    resolve(true)
                }
            } catch (err) {
                reject(false)
            }
        })
    }
}