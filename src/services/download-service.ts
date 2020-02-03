import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders as Headers} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {finalize} from 'rxjs/operators';

/**
 * Download file class
 */
@Injectable()
export class DownloadService {
    /**
     * Progress % of upload or download
     * @type {number}
     */
    private progress: any = false;

    public pushProgressFilesInfo: BehaviorSubject<any>;

    /**
     *
     * @param {Platform} platform
     * @param http
     * @param {File} file
     * @param webview
     * @param {Toast} toast
     */
    constructor(public http: HttpClient,
                public platform: Platform,
                public file: File,
                public webview: WebView,
                private toast: Toast
    ) {
        this.pushProgressFilesInfo = new BehaviorSubject<any>({});
    }

    /**
     * Download a file locally
     *
     * @param {string} url
     * @param {string} name
     * @param {string} modelFolder
     * @param authToken
     * @returns {Promise<string | boolean>}
     */
    async downloadAndSaveFile(url: string, name: string, modelFolder: string, authToken = ''): Promise<any> {
        const promise = new Promise(resolve => {
            // Not on cordova
            const finalPath = this.file.dataDirectory + modelFolder + '/' + name;

            this.isExistFile(this.file.dataDirectory + modelFolder + '/', name)
                .then(isExist => {
                    if (isExist) {
                        resolve(finalPath);
                        return;
                    } else {
                        this.download(url, authToken)
                            .then(response => {
                                if (!response || !response.body) {
                                    resolve(false);
                                    return;
                                }
                                this.getDownloadDirectoryPath(this.file.dataDirectory, modelFolder)
                                    .then((directory) => {
                                        this.file.writeFile(
                                            this.file.dataDirectory + modelFolder,
                                            name,
                                            response.body,
                                            { replace: true }
                                            )
                                            .then(fe => {
                                                resolve(finalPath);
                                                return;
                                            }).catch(writeFileErr => {
                                                resolve(false);
                                                return;
                                            });
                                    });
                            }, downloadErr => {
                                resolve(false);
                                // Download failed
                            });
                    }
                });
        });

        return await promise;
    }

    download(url, authToken): Promise<any> {
        const headers = new Headers(
            {'Content-Type': 'application/json', 'X-Auth-Token': authToken, 'Access-Control-Allow-Origin': '*'}
        );

        return new Promise((resolve) => {
            this.http.get(
                url,
                {
                    headers: headers,
                    observe: 'response',
                    responseType: 'blob'
                }
            )
                .toPromise()
                .then(response => {
                    resolve(response);
                    return;
                }, downloadErr => {
                    resolve(false);
                    return;
                });
        });
    }

    protected isExistFile(directory, name): Promise<boolean> {
        return new Promise(resolve => {
            this.file.checkFile(directory, name).then(existFile => {
                resolve(true);
            }).catch(err => {
                resolve(false);
            });
        });
    }

    protected getDownloadDirectoryPath(baseSystemPath, folder) {
        return new Promise((resolve) => {
            this.checkDir(folder)
                .then(() => {
                    resolve(baseSystemPath + folder);
                });
        });
    }

    startUpload(
        modelName,
        fileKey: string,
        fileName: string,
        path: string,
        url: string,
        authToken: string
    ): Promise<boolean> {
        return new Promise(resolve => {
            this.file.resolveDirectoryUrl(this.file.dataDirectory + modelName).then((directoryEntry) => {
                console.log('directoryEntry', directoryEntry);
                this.file.getFile(directoryEntry, fileName, {})
                    .then(fileEntry => {
                        fileEntry.file(file => {
                            this.readFile(fileKey, file, url, authToken);
                            resolve(true);
                            return;
                        });
                    })
                    .catch(err => {
                        console.log('errror', err);
                        resolve(false);
                        return;
                    });
            }).catch(err => {
                resolve(false);
                return;
            });
        });
    }

    readFile(fileKey: string, file: any, url: string, authToken: string) {
        const reader = new FileReader();
        reader.onload = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append(fileKey, imgBlob, file.name);
            this.uploadImageData(formData, url);
        };
        reader.readAsArrayBuffer(file);
    }

    async uploadImageData(formData: FormData, url: string) {
        this.http.post(url, formData)
            .pipe(
                finalize(() => {
                    // loading.dismiss();
                })
            )
            .subscribe(res => {
                //
            });
    }

    /**
     *
     * @param apiPath API Url of the file
     * @param localPath Local fullpath
     * @returns {any}
     */
    public path(apiPath, localPath) {
        if (!apiPath && !localPath) {
            return null;
        }

        // Web
        if (/*this.platform.is('core') || */this.platform.is('mobileweb')) {
            return apiPath;
        }
        // App
        else {
            return localPath;
        }
    }

    /**
     * Copy a file to the app storage
     *
     * @param {string} fullPath
     * @param {string} nativePath
     * @param {string} modelName
     * @returns {Promise<string | boolean>}
     */
    public copy(
        fullPath: string,
        modelName: string
    ): Promise< string | boolean >
    {
        return new Promise(resolve => {
            let d = new Date();
            let correctPath = fullPath.substr(0, fullPath.lastIndexOf('/') + 1);
            let currentName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);
            let currentExt = fullPath.substring(fullPath.lastIndexOf('.') + 1, fullPath.length);

            let newFilePath = this.file.dataDirectory + modelName;
            let newFileName = d.getTime() + "." + currentExt;

            this.checkDir(modelName).then(
                suc => {
                    this.copyToLocalDir(correctPath, currentName, newFilePath, newFileName).then(success => {
                        if (success) {
                            resolve(newFilePath + '/' + newFileName);
                        } else {
                            resolve(false);
                        }
                    }, error => {
                        resolve(false);
                    });
                },
                err => {
                    resolve(false);
                });
        });
    }

    /**
     * Copy file to a local dir
     * @param {string} namePath
     * @param {string} currentName
     * @param {string} newFilePath
     * @param {string} newFileName
     * @returns {Promise<boolean>}
     */
    private copyToLocalDir(
        namePath: string,
        currentName: string,
        newFilePath: string,
        newFileName: string
    ): Promise<boolean> {
        return new Promise(resolve => {
            this.file.copyFile(namePath, currentName, newFilePath, newFileName).then(success => {
                resolve(true);
            }, error => {
                resolve(false);
            });
        });
    }

    /**
     * Check if a dir exists and creats it if not.
     *
     * @param {string} modelName
     * @returns {Promise<boolean>}
     */
    private checkDir(modelName: string): Promise<boolean> {
        return new Promise(resolve => {

            this.file.checkDir(this.file.dataDirectory, modelName).then(_ => {
                resolve(true);
            }).catch(err => {
                this.file.createDir(this.file.dataDirectory, modelName, false).then(_ => {
                    resolve(true);
                });
            });
        });
    }

    /**
     * Check if a dir exists and delete it if exists.
     *
     * @param {string} modelName
     * @returns {Promise<boolean>}
     */
    removeAllAppFiles(): Promise<boolean> {
        return new Promise(resolve => {
            this.file.listDir(this.file.dataDirectory, '').then((result) => {
                if (!result.length) {
                    resolve(true);
                    return;
                }
                if (result.length) {
                    for (const fileSystemEntry of result) {
                        if (fileSystemEntry.isFile === true) {
                            this.file.removeFile(this.file.dataDirectory, fileSystemEntry.name)
                                .then(_ => {
                                    resolve(true);
                                    return;
                                }).catch(err => {
                                    resolve(false);
                                    return;
                                });
                        } else {
                            this.file.removeRecursively(this.file.dataDirectory,  fileSystemEntry.name)
                                .then(_ => {
                                    resolve(true);
                                    return;
                                }).catch(err => {
                                    resolve(false);
                                    return;
                                });
                        }
                    }
                }
            });
        });
    }

    /**
     * Delete a file
     *
     * @param {string} fullPath
     */
    public deleteFile(fullPath: string) {
        if (fullPath) {
            let path = fullPath.substr(0, fullPath.lastIndexOf('/') + 1);
            let fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);

            this.file.removeFile(path, fileName).then(success => {
            }, error => {
                console.error('DownloadService', 'deleteFile', path, fileName, error);
            });
        }
    }
}
