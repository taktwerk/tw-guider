import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders as Headers} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {finalize} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {IOSFilePicker} from '@ionic-native/file-picker/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {MediaCapture} from '@ionic-native/media-capture/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';

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
     * @param domSanitizer
     * @param fileChooser
     * @param filePicker
     * @param filePath
     * @param mediaCapture
     * @param camera
     * @param videoEditor
     */
    constructor(public http: HttpClient,
                public platform: Platform,
                public file: File,
                public webview: WebView,
                private toast: Toast,
                private domSanitizer: DomSanitizer,
                private fileChooser: FileChooser,
                private filePicker: IOSFilePicker,
                private filePath: FilePath,
                private mediaCapture: MediaCapture,
                private camera: Camera,
                private videoEditor: VideoEditor
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
                this.file.getFile(directoryEntry, fileName, {})
                    .then(fileEntry => {
                        fileEntry.file(file => {
                            this.readFile(fileKey, file, url, authToken);
                            resolve(true);
                            return;
                        });
                    })
                    .catch(err => {
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
            this.uploadImageData(formData, url, authToken);
        };
        reader.readAsArrayBuffer(file);
    }

    async uploadImageData(formData: FormData, url: string, authToken: string) {
        const headers = new Headers({
            'X-Auth-Token': authToken
        });
        this.http.post(url, formData, {headers: headers})
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
        } else {
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
    public copy(fullPath: string, modelName: string): Promise< string > {
        return new Promise(resolve => {
            const date = new Date();
            const correctPath = fullPath.substr(0, fullPath.lastIndexOf('/') + 1);
            const currentName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);
            const currentExt = fullPath.substring(fullPath.lastIndexOf('.') + 1, fullPath.length);
            const newFilePath = this.file.dataDirectory + modelName;
            const newFileName = date.getTime() + '.' + currentExt;

            this.checkDir(modelName).then(
                suc => {
                    this.copyToLocalDir(correctPath, currentName, newFilePath, newFileName).then(success => {
                        if (success) {
                            resolve(newFilePath + '/' + newFileName);
                        } else {
                            console.log('is not success copy dir');
                            resolve('');
                        }
                    }, error => {
                        console.log('copyToLocalDir error', error);
                        resolve('');
                    });
                },
                err => {
                    console.log('checkDir error', err);
                    resolve('');
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
            console.log('namePath', namePath);
            console.log('currentName', currentName);
            console.log('newFilePath', newFilePath);
            console.log('newFileName', newFileName);
            this.file.copyFile(namePath, currentName, newFilePath, newFileName).then(success => {
                resolve(true);
            }, error => {
                console.log('copyFile error', error);
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
                console.log('is removed file', success);
            }, error => {
                console.error('DownloadService', 'deleteFile', path, fileName, error);
            });
        }
    }

    public getNativeFilePath(path, modelName) {
        return this.file.dataDirectory + modelName + '/' + path;
    }

    public getWebviewFileSrc(path) {
        return this.webview.convertFileSrc(path);
    }

    public getSanitizedFileUrl(path, modelName) {
        path = this.getNativeFilePath(path, modelName);
        const convertFileSrc = this.getWebviewFileSrc(path);

        return this.domSanitizer.bypassSecurityTrustResourceUrl(convertFileSrc);
    }

    public async chooseFile() {
        if (this.platform.is('ios')) {
            if (!this.filePicker) {
                throw new Error('IOSFilePicker plugin is not defined');
            }
            return this.filePicker.pickFile();
        } else {
            if (!this.fileChooser) {
                throw new Error('FileChooser plugin is not defined');
            }
            const uri = await this.fileChooser.open();

            return this.getResolvedNativeFilePath(uri);
        }
    }

    public async recordVideo() {
        if (!this.mediaCapture) {
            throw new Error('MediaCapture plugin is not defined');
        }
        const videoFile = await this.mediaCapture.captureVideo({limit: 1});
        if (!videoFile || !videoFile[0]) {
            throw new Error('Video was not uploaded.');
        }
        const fullPath = videoFile[0].fullPath;

        return this.getResolvedNativeFilePath(fullPath);
    }

    public async makeVideoThumbnail(videoFileUri) {
        const option: CreateThumbnailOptions = {
            fileUri: videoFileUri,
            width: 160,
            height: 206,
            atTime: 1,
            outputFileName: 'sample'
        };
        let videoThumbnailPath = await this.videoEditor.createThumbnail(option);
        if (videoThumbnailPath) {
            videoThumbnailPath = 'file://' +  videoThumbnailPath;
        }

        return this.getResolvedNativeFilePath(videoThumbnailPath);
    }

    public async makePhoto(targetWidth = 1000, targetHeight = 1000) {
        if (!this.camera) {
            throw new Error('MediaCapture plugin is not defined');
        }
        const cameraOptions = {
            targetWidth: targetWidth,
            targetHeight: targetHeight,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        const photoFullPath = await this.camera.getPicture(cameraOptions);

        return this.getResolvedNativeFilePath(photoFullPath);
    }

    public getResolvedNativeFilePath(uri) {
        if (!this.filePath) {
            throw new Error('FilePath plugin is not defined');
        }
        console.log('uri', uri);
        if (this.platform.is('android')) {
            return this.filePath.resolveNativePath(uri);
        }

        return new Promise((resolve) => resolve(uri));
    }
}
