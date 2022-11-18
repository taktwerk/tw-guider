/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable, PLATFORM_ID, SecurityContext } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { File } from '@ionic-native/file/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { DomSanitizer, SafeResourceUrl, ɵDomSanitizerImpl } from '@angular/platform-browser';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
// import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { MediaCapture } from '@awesome-cordova-plugins/media-capture/ngx';

import { Camera, CameraResultType } from '@capacitor/camera';

import { CreateThumbnailOptions, VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { Filesystem, Directory, } from '@capacitor/filesystem';
import { LoggerService } from './logger-service';
// import WebFile from '../web-plugins/WebFile';
import { isPlatformBrowser } from '@angular/common';

export class RecordedFile {
  uri: any;
  thumbnailUri?: string;
  type?: string;
  // public imagePath;
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
   * @param sanitizerImpl
   */

  // webfile: WebFile;
  testBrowser: boolean;

  constructor(
    public http: HttpClient,
    public platform: Platform,
    public file: File,
    public webview: WebView,
    private domSanitizer: DomSanitizer,
    private fileChooser: Chooser,
    private filePath: FilePath,
    private mediaCapture: MediaCapture,
    private videoEditor: VideoEditor,
    protected sanitizerImpl: ɵDomSanitizerImpl,
    private loggerService: LoggerService,
    @Inject(PLATFORM_ID) platformId: string

  ) {

    // if (!this.platform.is('capacitor')) {
    //   this.webfile = new WebFile();
    // }

    this.testBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Download a file locally
   *
   * @param authToken
   */
  async downloadAndSaveFile(url: string, name: string, modelFolder: string, authToken = ''): Promise<any> {
    const promise = new Promise((resolve) => {
      const finalPath = this.file.dataDirectory + modelFolder + '/' + name;
      if (!this.platform.is('capacitor')) {
        resolve(url);
        return;
      }

      this.isExistFile(this.file.dataDirectory + modelFolder + '/', name).then((isExist) => {
        if (isExist) {
          resolve(finalPath);
          return;
        } else {
          this.download(url, authToken)
            .then(
              (response) => {
                if (!response || !response.body) {
                  resolve(false);
                  return;
                }
                this.getDownloadDirectoryPath(this.file.dataDirectory, modelFolder).then((directory) => {
                  this.file
                    .writeFile(this.file.dataDirectory + modelFolder, name, response.body, { replace: true })
                    .then((fe) => {
                      resolve(finalPath);
                      return;
                    })
                    .catch((writeFileErr) => {
                      console.log('Error at getDownloadDirectoryPath download-service 91', writeFileErr);
                      resolve(false);
                      return;
                    });
                });
              }
              // (downloadErr) => {
              //   resolve(false);
              //   // Download failed
              // }
            )
            .catch((e) => {
              console.log('Error at downloadAndSaveFile download-service 73');
              console.log(e);
              resolve(false);
              // Download failed
            });
        }
      });
    });

    return await promise;
  }

  previewSecuredImage(url: any) {
    return url;
  }

  download(url: any, authToken?: string): Promise<any> {
    if (url.includes('/api/api/')) {
      url = url.replace('/api/api/', '/api/');
    }

    const headerObject: any = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    if (authToken) {
      headerObject['X-Auth-Token'] = authToken;
    }

    console.log('headerObject', headerObject);

    const headers = new Headers(headerObject);

    return new Promise((resolve) => {
      this.http
        .get(url, { headers, observe: 'response', responseType: 'blob' })
        .toPromise()
        .then((response) => {
          resolve(response);
          return;
        })
        .catch((downloadErr) => {
          resolve(false);
          return;
        });
    });
  }

  protected isExistFile(directory: any, name: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.platform.is('capacitor')) {
        this.file
          .checkFile(directory, name)
          .then((existFile) => resolve(existFile))
          .catch((err) => resolve(false));
      } else {
        // this.webfile
        //   .checkFile(directory, name)
        //   .then((existFile: any) => resolve(existFile))
        //   .catch((err) => resolve(false));
        resolve(false);
      }
    });
  }

  protected getDownloadDirectoryPath(baseSystemPath: any, folder: any) {
    return new Promise((resolve) => {
      this.checkDir(folder).then(() => {
        resolve(baseSystemPath + folder);
      });
    });
  }

  startUpload(directoryName:any, fileKey: string, fileName: string, path: string, url: string, headers?: Headers): Promise<any> {
    return new Promise(async (resolve) => {
      try {
        fileName = path.substring(path.lastIndexOf('/') + 1, path.length);

        // const fileUriObject = await Filesystem.getUri({
        //   directory: FilesystemDirectory.Data,
        //   path: directoryName + '/' + fileName
        // });

        // const fileUri = Capacitor.convertFileSrc(fileUriObject.uri);

        // const downloadedImage = await this.download(fileUri);
        // const imgBlob = downloadedImage.body;

        const filebBase64 = await Filesystem.readFile({
          directory: Directory.Data,
          path: this.platform.is('android') ? directoryName + '/' + fileName : this.platform.is('ios') ? path : directoryName + '/' + fileName,
        });

        // console.log(" directoryName + '/' + fileName ", directoryName + '/' + fileName)
        // console.log("path", path)

        // Filesystem.readFile({
        //   directory: FilesystemDirectory.Data,
        //   path: this.platform.is('ios') ? path : this.platform.is('android') ? directoryName + '/' + fileName : directoryName + '/' + fileName
        // }).then(async (res) => {
        //   console.log(res)
        //   const customBlob = this.base64ToBlob(res.data)
        //   const formData = new FormData();
        //   formData.append(fileKey, customBlob, fileName);
        //   const isUploadedFile = await this.uploadFile(formData, url, headers);
        //   resolve(isUploadedFile);

        // }).catch((e) => {
        //   console.log("erro at startUpload when readFile")
        //   console.log(e)
        // })

        const customBlob = this.base64ToBlob(filebBase64.data);
        const formData = new FormData();
        formData.append(fileKey, customBlob, fileName);

        const isUploadedFile = await this.uploadFile(formData, url, headers);
        resolve(isUploadedFile);
        return;
      } catch (error) {
        console.log('Error at startUpload download-service 178');
      }
    });
  }

  base64ToBlob(data: any) {
    let rImageType = /data:(image\/.+);base64,/;
    let mimeString = '';
    let raw; let uInt8Array; let i; let rawLength;

    raw = data.replace(rImageType, (header: any, imageType: any) => {
      mimeString = imageType;
      return '';
    });

    raw = atob(raw);
    rawLength = raw.length;
    uInt8Array = new Uint8Array(rawLength);

    for (i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: mimeString });
  }

  readFile(fileKey: string, file: any, url: string, headers?: Headers): Promise<Blob> {
    return new Promise((resolve) => {
      const reader: any = new FileReader();
      reader.onload = () => {
        const imgBlob = new Blob([reader.result], { type: file.type });
        resolve(imgBlob);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  uploadFile(formData: FormData, url: string, headers?: Headers): Promise<any> {
    return new Promise((resolve) => {
      this.http
        .post(url, formData, { headers })
        .toPromise()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }

  /**
   *
   * @param apiPath API Url of the file
   * @param localPath Local fullpath
   */
  public path(apiPath: any, localPath: any) {
    if (!apiPath && !localPath) {
      return null;
    }

    // Web
    if (/*this.platform.is('core') || */ this.platform.is('mobileweb')) {
      return apiPath;
    } else {
      return localPath;
    }
  }

  /**
   * Copy a file to the app storage
   *
   * @param isDuplicate
   */
  public copy(fullPath: string, modelName: string, isDuplicate = false): Promise<string> {
    return new Promise((resolve) => {
      // console.log('fullPath', fullPath);
      const date = new Date();
      const correctPath = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
      const currentName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);
      const currentExt = fullPath.substring(fullPath.lastIndexOf('.') + 1, fullPath.length);
      const newFilePath = this.file.dataDirectory + modelName;
      let newFileName = '';
      if (isDuplicate) {
        newFileName = `duplicated_${currentName}`;
      } else {
        newFileName = date.getTime() + '.' + currentExt;
      }

      // this.checkDir(modelName).then(
      //   (suc) => {
      //     console.log(suc)
      //     if (suc) {
      //       console.log(correctPath, currentName, newFilePath, newFileName)
      //       this.copyToLocalDir(correctPath, currentName, newFilePath, newFileName).then((success) => {
      //         if (success) {
      //           resolve(newFilePath + '/' + newFileName);
      //         } else {
      //           console.log('is not success copy dir');
      //           resolve('');
      //         }
      //       },
      //         (error) => {
      //           resolve('');
      //         }
      //       );
      //     }
      //   },
      //   (err) => {
      //     resolve('');
      //   }
      // );

      this.checkDir(modelName)
        .then((res) => {
          this.copyToLocalDir(correctPath, currentName, newFilePath, newFileName)
            .then((success) => {
              resolve(newFilePath + '/' + newFileName);
            })
            .catch((e) => {
              resolve('');
            });
        })
        .catch((e) => {
          resolve('');
        });
    });
  }

  /**
   * Copy file to a local dir
   */
  public copyToLocalDir(namePath: string, currentName: string, newFilePath: string, newFileName: string): Promise<boolean> {
    return new Promise((resolve) => {
      // TODO: Replace with Capacitor https://capacitorjs.com/docs/v3/apis/filesystem#copyoptions
      this.file
        .copyFile(namePath, currentName, newFilePath, newFileName)
        .then(() => resolve(true))
        .catch((error) => {
          resolve(false);
        });
    });
  }

  /**
   * Check if a dir exists and creats it if not.
   *
   */
  private checkDir(modelName: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.platform.is('capacitor')) {
        this.file
          .checkDir(this.file.dataDirectory, modelName)
          .then((_) => {
            resolve(true);
          })
          .catch((err) => {
            this.file.createDir(this.file.dataDirectory, modelName, false).then((_) => {
              resolve(true);
            });
          });
      } else {
        // this.webfile.checkDir().then((_) => {
        //   resolve(true);
        // });
        resolve(false);
      }
    });
  }

  checkTempDir(dir: any): Promise<boolean> {
    return new Promise((resolve) => {
      this.file
        .checkDir(this.file.dataDirectory, dir)
        .then((_) => {
          resolve(true);
        })
        .catch((err) => {
          this.file.createDir(this.file.dataDirectory, dir, false).then((_) => {
            resolve(true);
          });
        });
    });
  }

  /**
   * Check if a dir exists and delete it if exists.
   *
   */
  removeAllAppFiles(): Promise<boolean> {
    return new Promise((resolve) => {
      this.file.listDir(this.file.dataDirectory, '').then((result) => {
        if (!result.length) {
          resolve(true);
          return;
        }
        if (result.length) {
          for (const fileSystemEntry of result) {
            if (fileSystemEntry.isFile === true) {
              this.file
                .removeFile(this.file.dataDirectory, fileSystemEntry.name)
                .then((_) => {
                  resolve(true);
                  return;
                })
                .catch((err) => {
                  console.log('removeAllAppFiles removeFile error at download-service 475', err);
                  resolve(false);
                  return;
                });
            } else {
              this.file
                .removeRecursively(this.file.dataDirectory, fileSystemEntry.name)
                .then((_) => {
                  resolve(true);
                  return;
                })
                .catch((err) => {
                  console.log('removeAllAppFiles removeRecursively error at download-service 475', err);
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
   */
  public deleteFile(fullPath: string) {
    if (!this.platform.is('capacitor')) {
      return;
    }

    if (fullPath) {
      const path = fullPath.substring(0, fullPath.lastIndexOf('/') + 1);
      const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1, fullPath.length);

      this.file.removeFile(path, fileName).then((success) => { }, (error) => { });
    }
  }

  public getNativeFilePath(path: any, modelName: any) {
    return this.file.dataDirectory + modelName + '/' + path;
  }

  public getWebviewFileSrc(path: any) {
    if (this.platform.is('capacitor')) {
      return this.webview.convertFileSrc(path);
    }
    return path;
  }

  public getSanitizedFileUrl(path: any, modelName: any, sanitizeType = 'trustResourceUrl'): SafeResourceUrl {
    path = this.getNativeFilePath(path, modelName);
    const convertFileSrc = this.getWebviewFileSrc(path);

    return this.getSafeUrl(convertFileSrc, sanitizeType);
  }

  public getSafeUrl(convertFileSrc: any, sanitizeType = 'trustResourceUrl'): any {
    const safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(convertFileSrc);

    if (sanitizeType === 'trustStyle') {
      return this.sanitizerImpl .sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    }

    return safeUrl;
  }

  public async chooseFileFromLocalPC(accept: any = '*/*'): Promise<string> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.onchange = (e: any) => {
        const reader = new FileReader();
        // const url = URL.createObjectURL(e.target.files[0]);
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (_event) => {
          const url: any = reader.result;
          resolve(url);
        };

        // let reader: any = new FileReader();
        // reader.readAsArrayBuffer(e.target.files[0]);
        // reader.onload = (_event) => {
        //   console.log(_event.target.result);
        //   const url = window.URL.createObjectURL(_event.target.result);
        //   console.log(url);
        //   resolve(url);
        // }

        //   input.onchange = (e: any) => {
        //     // console.log(e.target.files[0].name);
        //     let reader = new FileReader();
        //     // this.imagePath = files;
        //     reader.readAsDataURL(e.target.files[0]);
        //     reader.onload = (_event) => {
        //       this.imgURL = reader.result;
        //       console.log("check image =>", this.imgURL);
        //     }
      };
      input.click();
    });
  }


  public async chooseFile(withThumbnailForVideo = false): Promise<RecordedFile> {

    const recordedFile = new RecordedFile();

    let uri: any = '';

    if (this.testBrowser) {
      recordedFile.uri = await this.chooseFileFromLocalPC();
      recordedFile.thumbnailUri = recordedFile.uri;
      return recordedFile;
    }
    else {
      if (!this.fileChooser) {
        throw new Error('FileChooser plugin is not defined');
      }
    
      uri = await (await this.fileChooser.getFile())?.uri;
  
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
        return (
          fileName.indexOf('.jpg') > -1 ||
          fileName.indexOf('.JPG') > -1 ||
          fileName.indexOf('.jpeg') > -1 ||
          fileName.indexOf('.JPEG') > -1 ||
          fileName.indexOf('.png') > -1 ||
          fileName.indexOf('.PNG') > -1 ||
          fileName.indexOf('.webp') > -1 ||
          fileName.indexOf('.WEBP') > -1
        );
      case 'pdf':
        return fileName.indexOf('.pdf') > -1;
      case 'video':
        return (
          fileName.indexOf('.MOV') > -1 ||
          fileName.indexOf('.mov') > -1 ||
          fileName.indexOf('.mp4') > -1 ||
          fileName.indexOf('.MP4') > -1 ||
          fileName.indexOf('.wmv') > -1 ||
          fileName.indexOf('.WMV') > -1 ||
          fileName.indexOf('.avi') > -1 ||
          fileName.indexOf('.AVI') > -1 ||
          fileName.indexOf('.webm') > -1 ||
          fileName.indexOf('.WEBM') > -1 ||
          fileName.indexOf('.mpeg') > -1 ||
          fileName.indexOf('.MPEG') > -1 ||
          fileName.indexOf('.mpg') > -1 ||
          fileName.indexOf('.MPG') > -1 ||
          fileName.indexOf('.m4v') > -1 ||
          fileName.indexOf('.M4V') > -1 ||
          fileName.indexOf('.mkv') > -1 ||
          fileName.indexOf('.MKV') > -1 ||
          fileName.indexOf('.ogv') > -1 ||
          fileName.indexOf('.OGV') > -1
        );
      case 'audio':
        return (
          fileName.indexOf('.mp3') > -1 ||
          fileName.indexOf('.MP3') > -1 ||
          fileName.indexOf('.m4a') > -1 ||
          fileName.indexOf('.M4A') > -1 ||
          fileName.indexOf('.m4p') > -1 ||
          fileName.indexOf('.M4P') > -1 ||
          fileName.indexOf('.aac') > -1 ||
          fileName.indexOf('.AAC') > -1 ||
          fileName.indexOf('.ogg') > -1 ||
          fileName.indexOf('.OGG') > -1 ||
          fileName.indexOf('.opus') > -1 ||
          fileName.indexOf('.OPUS') > -1 ||
          fileName.indexOf('.wav') > -1 ||
          fileName.indexOf('.wav') > -1 ||
          fileName.indexOf('.3g2') > -1 ||
          fileName.indexOf('.3g2') > -1 ||
          fileName.indexOf('.midi') > -1 ||
          fileName.indexOf('.midi') > -1 ||
          fileName.indexOf('.flac') > -1 ||
          fileName.indexOf('.FLAC') > -1
        );
      case '3d':
        return (
          fileName.indexOf('.gltf') > -1 ||
          fileName.indexOf('.GLTF') > -1 ||
          fileName.indexOf('.stp') > -1 ||
          fileName.indexOf('.STP') > -1 ||
          fileName.indexOf('.glb') > -1 ||
          fileName.indexOf('.GLB') > -1
        );
      default:
        return false;
    }
  }

  public async recordVideo(withThumbnail = false): Promise<RecordedFile> {
    const recordedFile = new RecordedFile();
    console.log(this.mediaCapture, this.testBrowser, recordedFile);
    if (!this.mediaCapture) {
      throw new Error('MediaCapture plugin is not defined');
    }


    if (!this.platform.is('capacitor')) {
      recordedFile.uri = await this.chooseFileFromLocalPC('video/*');
      return recordedFile;
    }

    // if (this.testBrowser) {
    //   console.log("testing browser specification...");
    //   let input = document.createElement('input');
    //   input.type = 'file';
    //   input.accept = 'video/*';
    //   input.onchange = (e: any) => {
    //     // console.log(e.target.files[0].name);
    //     let reader = new FileReader();
    //     // this.imagePath = files;
    //     reader.readAsDataURL(e.target.files[0]);
    //     reader.onload = (_event) => {
    //       this.imgURL = reader.result;
    //       console.log("check image =>", this.imgURL);
    //     }
    //   }
    //   input.click();
    // }



    // try {
    //   this.mediaCapture.captureVideo().then(video => {
    //     console.log(video);
    //   }).catch(err => {
    //     console.log(err)
    //   })
    //  } catch (e) {
    //     console.log(e);
    //   }


    const videoFile:any = await this.mediaCapture.captureVideo({ limit: 1 });
    if (!videoFile || !videoFile[0]) {
      throw new Error('Video was not uploaded.');
    }

    const fullPath = videoFile[0].fullPath;
    //  const recordedFile = new RecordedFile();
    // console.log('recordedFile.uri ', recordedFile.uri);
    // console.log('recordedFile.thumbnailUri ', recordedFile.thumbnailUri);


    // recordedFile.uri = await this.getResolvedNativeFilePath(fullPath);
    recordedFile.uri = fullPath;

    recordedFile.thumbnailUri = recordedFile.uri;
    // if (recordedFile.uri && withThumbnail) {
    //   recordedFile.thumbnailUri = await this.makeVideoThumbnail(recordedFile.uri);
    // }
    return recordedFile;
  }

  public async makePhoto(targetWidth = 1000, targetHeight = 1000): Promise<RecordedFile> {
    const recordedFile = new RecordedFile();
    console.log(Camera, this.testBrowser);
    if (!Camera) {
      throw new Error('MediaCapture plugin is not defined');
    }

    if (!this.platform.is('capacitor')) {
      recordedFile.uri = await this.chooseFileFromLocalPC('image/*');
      return recordedFile;
    }

    // if (this.testBrowser) {
    //   console.log("testing browser specification...");
    //   let input = document.createElement('input');
    //   input.type = 'file';
    //   input.accept = 'camera/*';
    //   input.onchange = (e: any) => {
    //     // console.log(e.target.files[0].name);
    //     let reader = new FileReader();
    //     // this.imagePath = files;
    //     reader.readAsDataURL(e.target.files[0]);
    //     reader.onload = (_event) => {
    //       this.imgURL = reader.result;
    //       console.log("check image =>", this.imgURL);
    //     }
    //   }
    //   input.click();
    // }


    console.log('photoFullPath');

    const photoFullPath = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    // const cameraOptions = {
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   mediaType: this.camera.MediaType.ALLMEDIA,
    // };

    // const photoFullPath = await this.camera.getPicture(cameraOptions);
    // const recordedFile = new RecordedFile();

    // recordedFile.uri = await this.getResolvedNativeFilePath(photoFullPath.path);
    recordedFile.uri = photoFullPath.base64String;
    recordedFile.thumbnailUri = recordedFile.uri;

    console.log(recordedFile);
    return recordedFile;
  }

  public async makeVideoThumbnail(videoFileUri: string): Promise<string> {
    const option: CreateThumbnailOptions = {
      fileUri: videoFileUri,
      width: 160,
      height: 206,
      atTime: 1,
      outputFileName: 'sample',
    };
    let videoThumbnailPath = await this.videoEditor.createThumbnail(option);
    if (videoThumbnailPath) {
      videoThumbnailPath = 'file://' + videoThumbnailPath;
    }

    return this.getResolvedNativeFilePath(videoThumbnailPath);
  }

  public getResolvedNativeFilePath(uri: any): Promise<string> {
    const recordedFile = new RecordedFile();

    // console.log('URIII', uri);
    if (!this.filePath) {
      throw new Error('FilePath plugin is not defined');
    }

    if (this.platform.is('ios') && uri.indexOf('file://') < 0) {
      uri = 'file://' + uri;
    }

    return new Promise((resolve) => resolve(uri));
  }
}