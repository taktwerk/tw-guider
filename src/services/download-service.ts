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
    constructor(public platform: Platform,
                public http: HttpClient,
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
    public download(url: string, name: string, modelFolder: string, authToken = ''): Promise<string | boolean> {
        return new Promise(resolve => {
            // Not on cordova
            if (!this.fileTransfer) {
                console.warn('DownloadService', 'Download', 'no fileTransfer object');
                resolve(false);
            }

            const finalPath = this.file.dataDirectory + modelFolder + '/' + name;

            this.file.checkFile(this.file.dataDirectory + modelFolder + '/', name).then(_ => {
                console.log('check file my');
                // File already exists, change nothing
                resolve(finalPath);
            }).catch(err => {
                console.log('download file url', url);
                const headers = new Headers({'Content-Type': 'application/json', 'X-Auth-Token': authToken, 'Access-Control-Allow-Origin': '*'});
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
                       console.log('was downloading', response);
                       this.file.checkDir(this.file.dataDirectory, modelFolder).then(
                           (exists) => {
                               console.log('directory is exists');
                               this.file.writeFile(
                                   this.file.dataDirectory + modelFolder,
                                   name,
                                   response.body,
                                   { replace: true })
                                   .then(fe => {
                                       console.log('file created', fe);
                                       // if (events && eventName) {
                                       //     events.publish(eventName);
                                       // }
                                       // All went well, resolve the Promise.
                                       resolve(finalPath);
                                   }).catch(writeFileErr => {
                                       resolve(false);
                                       console.log('file was not created created', writeFileErr);
                                   // writeFile failed
                               });
                           },
                           (checkDirError) => {
                               this.file.createDir(this.file.dataDirectory, modelFolder, false)
                                   .then(de => {
                                       console.log('directory created', de);
                                       // Write the downloaded Blob as the file. Note that the file will
                                       // be overwritten if it already exists!
                                       this.file.writeFile(
                                           de.toURL(),
                                           name,
                                           response.body,
                                           { replace: true })
                                           .then(fe => {
                                               // if (events && eventName) {
                                               //     events.publish(eventName);
                                               // }
                                               console.log('file created', fe);
                                               // All went well, resolve the Promise.
                                               resolve(finalPath);
                                           }).catch(writeFileErr => {
                                           console.log('file was not created created', writeFileErr);
                                           // writeFile failed
                                       });
                                   }).catch(createDirErr => {
                                   console.log('directory was not created created', createDirErr);
                                   resolve(false);
                                   // createDir failed

                               });
                           }).catch( (exception) => { console.log(exception); } );
                    }, downloadErr => {
                        console.log('file was not downloading', downloadErr);
                        resolve(false);
                        // Download failed
                    });
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
            console.error('DownloadService', 'Upload', err);
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

            //console.log('DownloadService', 'copy', 'filePath', fullPath);
            //console.log('DownloadService', 'copy', 'correctPath', correctPath, 'currentName', currentName);
            //console.log('DownloadService', 'copy', 'newFilePath', newFilePath, 'newFileName', newFileName);

            this.checkDir(modelName).then(
                suc => {
                    this.copyToLocalDir(correctPath, currentName, newFilePath, newFileName).then(success => {
                        if (success) {
                            resolve(newFilePath + '/' + newFileName);
                        } else {
                            resolve(false);
                        }
                    }, error => {
                        console.error('DownloadService', 'Copy', error);
                        resolve(false);
                    });
                },
                err => {
                    console.error('DownloadService', 'Create dir', err);
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
                //console.log('DownloadService', 'CopyToLocalDir', success);
                resolve(true);
            }, error => {
                console.error('DownloadService', 'CopyToLocalDir', error);
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
