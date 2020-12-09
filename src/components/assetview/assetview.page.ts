import { Component, Input, OnInit } from '@angular/core';
import { DbApiModel } from 'src/models/base/db-api-model';
import { DownloadService } from 'src/services/download-service';
import { PictureService } from 'src/services/picture-service';
import { VideoService } from 'src/services/video-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Viewer3dService } from 'src/services/viewer-3d-service';
import { GuideAssetModelFileMapIndexEnum } from '../../models/db/api/guide-asset-model';

@Component({
  selector: 'model-assetcomponent',
  templateUrl: './assetview.page.html',
  styleUrls: ['./assetview.page.scss'],
})

export class AssetviewComponent implements OnInit {
  @Input() model: any;
  /**Set to true to make image small */
  @Input() mini: boolean;

  filePath3d

  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  constructor(private downloadService: DownloadService,
    private videoService: VideoService,
    private pictureService: PictureService,
    private photoViewer: PhotoViewer,
    private viewer3dService: Viewer3dService,
  ) { }

  ngOnInit() { }

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = this.model.title; // change later
    if (title) {
      fileTitle = title;
    }
    const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);

    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') ||
      this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      if (!fileApiUrl) {
        return false;
      }
      this.videoService.playVideo(fileUrl, fileTitle);
    }
    else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(fileUrl, fileTitle);
    }
    else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      this.pictureService.openFile(fileUrl, fileTitle);
    }
    else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
      this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
    }
  }
}
