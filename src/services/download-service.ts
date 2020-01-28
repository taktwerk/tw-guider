import {Injectable} from '@angular/core';
import {Events, Platform} from '@ionic/angular';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders as Headers} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';

/**
 * Download file class
 */
@Injectable()
export class DownloadService {
    /**
     *
     */
    private fileTransfer: FileTransferObject = this.transfer.create();

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
     * @param {FileTransfer} transfer
     * @param {Toast} toast
     */
    constructor(public http: HttpClient,
                public platform: Platform,
                public file: File,
                public webview: WebView,
                public transfer: FileTransfer,
                private toast: Toast
    ) {
        this.pushProgressFilesInfo = new BehaviorSubject<any>({});
        // Only use filetransfer on mobile
        if (/*this.platform.is('core') || */this.platform.is('mobileweb')) {
            //console.info('DownloadService', 'not on mobile.');
        } else {
            // Not web or computer
            this.fileTransfer = this.transfer.create();
        }
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

    /**
     * Upload a file
     *
     * @param {string} fileKey
     * @param {string} fileName
     * @param {string} path
     * @param {string} url
     * @param {string} authToken
     * @returns {boolean}
     */
    public upload(
        fileKey: string,
        fileName: string,
        path: string,
        url: string,
        authToken: string
    ) : Promise<boolean> {
      return new Promise((resolve) => {
        // Not on cordova
        if (!this.fileTransfer) {
          console.warn('UPLOAD', 'no fileTransfer object');
          resolve(false);
          return;
        }

        // Upload the file
        let options: FileUploadOptions = {
          fileKey: fileKey,
          fileName: fileName,
          chunkedMode: false,
          headers: {
            'X-Auth-Token': authToken
          }
        };

        this.fileTransfer.onProgress((progressEvent: ProgressEvent) => {
          if (!progressEvent) {
            return;
          }

          this.progress = Math.floor(progressEvent.loaded / progressEvent.total * 100);

          let temporaryPushFilesInfo = this.pushProgressFilesInfo.getValue();
          temporaryPushFilesInfo[fileName] = this.progress;
          this.pushProgressFilesInfo.next(temporaryPushFilesInfo);

          if (progressEvent.loaded == progressEvent.total) {
            this.toast.show('File uploaded', '5000', 'center').subscribe(
              toast => {
                console.log(toast);
              }
            );
          }
        });

        this.fileTransfer.upload(path, url, options)
          .then((data) => {
            let temporaryPushFilesInfo = this.pushProgressFilesInfo.getValue();

            resolve(true);
            console.log('DownloadService', 'Upload', data, " Uploaded Successfully");
          }, (err) => {
            resolve(false);
          });
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
