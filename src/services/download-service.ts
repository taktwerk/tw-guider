import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import {HttpClient, HttpHeaders as Headers} from '@angular/common/http';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {finalize} from 'rxjs/operators';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {IOSFilePicker} from '@ionic-native/file-picker/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {MediaCapture} from '@ionic-native/media-capture/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';

export class RecordedFile {
    uri: string;
    thumbnailUri?: string;
    type?: string;
}
/**
 * Download file class
 */
@Injectable()
export class DownloadService {
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
                {headers: headers, observe: 'response', responseType: 'blob'}
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
            this.file.checkFile(directory, name).then(existFile => resolve(existFile))
                .catch(err => resolve(false));
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

    startUpload(directoryName, fileKey: string, fileName: string, path: string, url: string, headers?: Headers): Promise<boolean> {
        return new Promise(resolve => {
            this.file.resolveDirectoryUrl(this.file.dataDirectory + directoryName).then((directoryEntry) => {
                this.file.getFile(directoryEntry, fileName, {})
                    .then(fileEntry => {
                        fileEntry.file(file => {
                            this.readFile(fileKey, file, url, headers);
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

    readFile(fileKey: string, file: any, url: string, headers?: Headers) {
        const reader = new FileReader();
        reader.onload = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {type: file.type});
            formData.append(fileKey, imgBlob, file.name);
            this.uploadFile(formData, url, headers);
        };
        reader.readAsArrayBuffer(file);
    }

    uploadFile(formData: FormData, url: string, headers?: Headers) {
        this.http.post(url, formData, {headers: headers})
            .pipe(
                finalize(() => {})
            )
            .subscribe(res => {});
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
            const path = fullPath.substr(0, fullPath.lastIndexOf('/') + 1);
            const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);

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

    public getSanitizedFileUrl(path, modelName): SafeResourceUrl {
        path = this.getNativeFilePath(path, modelName);
        const convertFileSrc = this.getWebviewFileSrc(path);

        return this.domSanitizer.bypassSecurityTrustResourceUrl(convertFileSrc);
    }

    public async chooseFile(withThumbnailForVideo = false): Promise<RecordedFile> {
        const recordedFile = new RecordedFile();
        let uri = '';
        if (this.platform.is('ios')) {
            if (!this.filePicker) {
                throw new Error('IOSFilePicker plugin is not defined');
            }
            uri = await this.filePicker.pickFile();
        } else {
            if (!this.fileChooser) {
                throw new Error('FileChooser plugin is not defined');
            }
            uri = await this.fileChooser.open();
        }
        if (uri) {
            recordedFile.uri = await this.getResolvedNativeFilePath(uri);
            if (withThumbnailForVideo && this.checkFileTypeByExtension(recordedFile.uri, 'video')) {
                recordedFile.thumbnailUri = await this.makeVideoThumbnail(recordedFile.uri);
            }
        }

        return recordedFile;
    }

    checkFileTypeByExtension(fileName: string, type: string): boolean {
        if (!fileName) {
            return false;
        }
        switch (type) {
            case 'image':
                return fileName.indexOf('.jpg') > -1 ||
                    fileName.indexOf('.JPG') > -1 ||
                    fileName.indexOf('.jpeg') > -1 ||
                    fileName.indexOf('.png') > -1 ||
                    fileName.indexOf('.PNG') > -1;
            case 'pdf':
                return fileName.indexOf('.pdf') > -1;
            case 'video':
                return fileName.indexOf('.MOV') > -1 ||
                    fileName.indexOf('.mov') > -1 ||
                    fileName.indexOf('.mp4') > -1 ||
                    fileName.indexOf('.MP4') > -1 ||
                    fileName.indexOf('.wmv') > -1 ||
                    fileName.indexOf('.WMV') > -1;
            case 'audio':
                return fileName.indexOf('.mp3') > -1 ||
                    fileName.indexOf('.MP3') > -1;
            default:
                return false;
        }
    }

    public async recordVideo(withThumbnail = false): Promise<RecordedFile> {
        if (!this.mediaCapture) {
            throw new Error('MediaCapture plugin is not defined');
        }
        const videoFile = await this.mediaCapture.captureVideo({limit: 1});
        if (!videoFile || !videoFile[0]) {
            throw new Error('Video was not uploaded.');
        }
        const fullPath = videoFile[0].fullPath;
        const recordedFile = new RecordedFile();
        recordedFile.uri = await this.getResolvedNativeFilePath(fullPath);
        if (recordedFile.uri && withThumbnail) {
            recordedFile.thumbnailUri = await this.makeVideoThumbnail(recordedFile.uri);
        }

        return recordedFile;
    }

    public async makePhoto(targetWidth = 1000, targetHeight = 1000): Promise<RecordedFile> {
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

        const recordedFile = new RecordedFile();
        recordedFile.uri = await this.getResolvedNativeFilePath(photoFullPath);

        return recordedFile;
    }

    public async makeVideoThumbnail(videoFileUri: string): Promise<string> {
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

    public getResolvedNativeFilePath(uri): Promise<string> {
        if (!this.filePath) {
            throw new Error('FilePath plugin is not defined');
        }
        if (this.platform.is('ios') && uri.indexOf('file://') < 0) {
            uri = 'file://' + uri;
        }
        if (this.platform.is('android')) {
            return this.filePath.resolveNativePath(uri);
        }

        return new Promise((resolve) => resolve(uri));
    }
}
