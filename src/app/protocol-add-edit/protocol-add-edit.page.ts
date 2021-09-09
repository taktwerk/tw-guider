import { ChangeDetectorRef, Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NavController, Platform } from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
import { DownloadService } from '../../services/download-service';
import { Network } from '@ionic-native/network/ngx';
import { HttpClient } from '../../services/http-client';
import { FilePath } from '@ionic-native/file-path/ngx';
import { TranslateConfigService } from '../../services/translate-config.service';
import { ProtocolModel } from '../../models/db/api/protocol-model';
import { ProtocolService } from '../../providers/api/protocol-service';
import { Md5 } from 'ts-md5';
import { ProtocolTemplateModel } from '../../models/db/api/protocol-template-model';
import { ProtocolTemplateService } from '../../providers/api/protocol-template-service';
import { WorkflowStepService } from '../../providers/api/workflow-step-service';
import { WorkflowTransitionModel } from '../../models/db/api/workflow-transition-model';
import { ProtocolCommentService } from '../../providers/api/protocol-comment-service';
import { ProtocolDefaultService } from '../../providers/api/protocol-default-service';
import { WorkflowService } from '../../providers/api/workflow-service';
import { WorkflowTransitionService } from '../../providers/api/workflow-transition-service';

import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { MiscService } from '../../services/misc-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'protocol-add-edit',
  templateUrl: 'protocol-add-edit.page.html',
  styleUrls: ['protocol-add-edit.page.scss']
})
export class ProtocolAddEditPage implements OnInit, OnDestroy {
  public model: ProtocolModel;
  public protocolId: number = null;
  public reference_id: number = null;
  public reference_model: string = null;
  public reference_model_alias: string = null;
  public protocol_form: any;
  private templateId: number;
  private clientId: number;
  public comment: string = null;
  public params;

  faClock = faClock;
  faUser = faUser;

  eventSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private file: File,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    public http: HttpClient,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public downloadService: DownloadService,
    private protocolService: ProtocolService,
    private protocolTemplateService: ProtocolTemplateService,
    private protocolCommentService: ProtocolCommentService,
    private protocolDefaultService: ProtocolDefaultService,
    private workflowStepService: WorkflowStepService,
    private workflowTransitionService: WorkflowTransitionService,
    private workflowService: WorkflowService,
    private navCtrl: NavController,
    private network: Network,
    private platform: Platform,
    private filePath: FilePath,
    private ngZone: NgZone,
    private translateConfigService: TranslateConfigService,
    private router: Router,
    private miscService: MiscService,

  ) {
    this.authService.checkAccess('protocol');
    this.comment = null;
    if (!this.model) {
      this.model = protocolService.newModel();
    }
  }

  dismiss() {
    this.model.deleteAttachedFilesForDelete();

    this.ngZone.run(() => {
      const protocolNavigationExtras: NavigationExtras = {
        queryParams: {
          referenceModelAlias: this.reference_model_alias,
          referenceId: this.reference_id
        }
      };
      this.router.navigate(['protocol'], protocolNavigationExtras);
    });
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  public async save() {
    if (!this.model[this.model.COL_ID]) {
      const protocolTemplate = await this.getProtocolTemplate(this.templateId);
      const templateWorkflow = await protocolTemplate.getWorkflow();
      if (!templateWorkflow) {
        return;
      }
      const workflowFirstStep = await templateWorkflow.getFirstStep();
      if (!workflowFirstStep) {
        return;
      }
      const md5 = new Md5();
      const protocolName = ('' + md5.appendStr('' + (new Date()).getTime()).end()).substr(0, 5).toUpperCase();
      this.model.client_id = this.clientId;
      this.model.protocol_template_id = protocolTemplate.idApi;
      this.model.workflow_step_id = workflowFirstStep.idApi;
      this.model.protocol_form_number = 0;
      this.model.protocol_form_table = this.protocol_form.TABLE_NAME;
      this.model.reference_model = 'taktwerk\\yiiboilerplate' + this.reference_model;
      this.model.reference_id = this.reference_id;
      this.model.name = protocolName;
      this.model.creator = this.getCreatorName();
      await this.model.save();
      this.protocolId = this.model[this.model.COL_ID];
      this.model.workflowStep = await this.workflowStepService.getById(this.model.workflow_step_id);
      this.model.canEditProtocol = await this.protocolService.canEditProtocol(this.model);
      this.model.canFillProtocol = await this.protocolService.canFillProtocol(this.model);
      if (!this.protocol_form.local_pdf_image) {
        this.protocol_form.local_pdf_image = await this.downloadService.copy(
          protocolTemplate[ProtocolTemplateModel.COL_LOCAL_PDF_IMAGE],
          this.protocol_form.TABLE_NAME
        );
      }
    }
    if (this.model.idApi) {
      this.protocol_form.protocol_id = this.model.idApi;
    }
    this.protocol_form.local_protocol_id = this.model[this.model.COL_ID];
    const isSaved = await this.protocol_form.save();
    if (isSaved) {
      if (!this.protocol_form.idApi) {
        this.model.local_protocol_form_number = this.protocol_form[this.protocol_form.COL_ID];
      }
      await this.model.save();
      if (this.comment) {
        const protocolCommentModel = this.protocolCommentService.newModel();
        if (this.model.idApi) {
          protocolCommentModel.protocol_id = this.model.idApi;
        }
        protocolCommentModel.local_protocol_id = this.model[this.model.COL_ID];
        protocolCommentModel.comment = this.comment;
        protocolCommentModel.event = 'comment';
        protocolCommentModel.name = 'a';
        protocolCommentModel.creator = this.getCreatorName();
        await protocolCommentModel.save();
        this.comment = null;
      }
      this.detectChanges();
      // this.events.publish('setIsPushAvailableData');
      this.miscService.events.next({ TAG: 'setIsPushAvailableData' });
      const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
      this.http.showToast(alertMessage);
    }
  }

  public getCreatorName() {
    const user = this.authService.auth;
    if (user.additionalInfo.fullname) {
      return user.additionalInfo.fullname;
    }

    return user.username;
  }

  public async transition(nextWorkflowTransition: WorkflowTransitionModel) {
    if (this.comment) {
      const writtenProtocolCommentModel = this.protocolCommentService.newModel();
      if (this.model.idApi) {
        writtenProtocolCommentModel.protocol_id = this.model.idApi;
      }
      writtenProtocolCommentModel.local_protocol_id = this.model[this.model.COL_ID];
      writtenProtocolCommentModel.comment = this.comment;
      writtenProtocolCommentModel.event = 'comment';
      writtenProtocolCommentModel.name = 'a';
      writtenProtocolCommentModel.creator = this.getCreatorName();
      await writtenProtocolCommentModel.save();
      this.comment = null;
    }
    const transitionProtocolCommentModel = this.protocolCommentService.newModel();
    if (this.model.idApi) {
      transitionProtocolCommentModel.protocol_id = this.model.idApi;
    }
    transitionProtocolCommentModel.local_protocol_id = this.model[this.model.COL_ID];
    transitionProtocolCommentModel.event = this.model.workflowStep.type;
    transitionProtocolCommentModel.old_workflow_step_id = nextWorkflowTransition.workflow_step_id;
    transitionProtocolCommentModel.new_workflow_step_id = nextWorkflowTransition.next_workflow_step_id;
    transitionProtocolCommentModel.name = 'b';
    transitionProtocolCommentModel.creator = this.getCreatorName();
    await transitionProtocolCommentModel.save();
    this.model.workflow_step_id = nextWorkflowTransition.next_workflow_step_id;
    await this.model.save();
    let previousProtocolFormFile = null;
    if (this.protocol_form.local_pdf_image) {
      previousProtocolFormFile = this.protocol_form.local_pdf_image;
    }
    const protocolFormService = this.protocolService.getProtocolFormService(this.model.protocol_form_table);
    this.protocol_form = protocolFormService.newModel();

    if (this.model.idApi) {
      this.protocol_form.protocol_id = this.model.idApi;
    }
    this.protocol_form.local_protocol_id = this.model[this.model.COL_ID];
    if (previousProtocolFormFile) {
      const savedFilePath = await this.downloadService.copy(previousProtocolFormFile, this.protocol_form.TABLE_NAME);
      const modelFileMap = this.protocol_form.downloadMapping[0];
      this.protocol_form[modelFileMap.url] = '';
      this.protocol_form[modelFileMap.localPath] = savedFilePath;
      this.protocol_form[modelFileMap.name] = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1, savedFilePath.length);
    }
    // return false;
    await this.protocol_form.save();

    this.model.local_protocol_form_number = this.protocol_form[this.protocol_form.COL_ID];
    await this.model.save();
    this.model.workflowStep = await this.workflowStepService.getById(this.model.workflow_step_id);
    this.model.canEditProtocol = await this.protocolService.canEditProtocol(this.model);
    this.model.canFillProtocol = await this.protocolService.canFillProtocol(this.model);
    this.detectChanges();
    // this.events.publish('setIsPushAvailableData');
    this.miscService.events.next({ TAG: 'setIsPushAvailableData' });
    const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
    this.http.showToast(alertMessage);
  }

  public getProtocolTemplate(templateId: number): Promise<ProtocolTemplateModel> {
    return new Promise((resolve) => {
      this.protocolTemplateService.dbModelApi.findFirst(
        [this.protocolTemplateService.dbModelApi.COL_ID_API, templateId]
      ).then((res) => {
        if (res && res[0]) {
          resolve(res[0]);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getProtcolFormModel() {
    const protocolFormService = this.protocolService.getProtocolFormService(this.model.protocol_form_table);
    if (!protocolFormService) {
      return null;
    }
    if (!this.model.local_protocol_form_number) {
      return protocolFormService.newModel();
    }
    const protocolFormModel = await protocolFormService['dbModelApi'].findFirst(
      [protocolFormService['dbModelApi'].COL_ID, this.model.local_protocol_form_number]
    );
    if (!protocolFormModel || !protocolFormModel[0]) {
      return protocolFormService.newModel();
    }

    return protocolFormModel[0];
  }

  async setExistModel() {
    if (this.protocolId) {
      this.workflowStepService.unsetWorkflowStepsListCache();
      const result = await this.protocolService.dbModelApi.findFirst([this.model.COL_ID, this.protocolId]);
      this.model = result[0];
      this.model.workflowStep = await this.workflowStepService.getById(this.model.workflow_step_id);
      this.model.canEditProtocol = await this.protocolService.canEditProtocol(this.model);
      this.model.canFillProtocol = await this.protocolService.canFillProtocol(this.model);
      this.model.comments = await this.protocolService.getComments(this.model);
      this.protocol_form = await this.getProtcolFormModel();
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      const protocolData = params;
      // console.log('protocol add edit page data', protocolData);
      this.templateId = +protocolData.templateId;
      this.clientId = +protocolData.clientId;
      this.reference_id = +protocolData.referenceId;
      this.reference_model_alias = protocolData.referenceModelAlias;
      this.reference_model = this.protocolService.dbModelApi.getReferenceModelByAlias(this.reference_model_alias);
      this.protocolId = +protocolData.protocolId;
      if (this.protocolId) {
        await this.setExistModel();
      } else {
        this.model = this.protocolService.newModel();
        this.model.client_id = this.clientId;
        this.model.protocol_template_id = this.templateId;
        this.model.reference_id = this.reference_id;
        this.model.reference_model = this.reference_model;
        this.model.protocol_form_table = 'protocol_default';
        this.protocol_form = await this.getProtcolFormModel();
        this.model.canEditProtocol = await this.protocolTemplateService.canCreateProtocol(this.templateId);
      }
      if (!this.protocol_form) {
        this.http.showToast('Can\'t open this protocol', '', 'danger', false);
        this.dismiss();
      }
      // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':update', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':delete', (model) => {
      //   if (model.id === this.model.protocol_template_id) {
      //     this.setExistModel();
      //     this.detectChanges();
      //   }
      // });
      // this.events.subscribe(this.protocolService.dbModelApi.TAG + ':update', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.protocolService.dbModelApi.TAG + ':delete', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.protocolDefaultService.dbModelApi.TAG + ':update', (model) => {
      //   console.log('protocolDefault update')
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.protocolDefaultService.dbModelApi.TAG + ':delete', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowService.dbModelApi.TAG + ':create', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowService.dbModelApi.TAG + ':update', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowService.dbModelApi.TAG + ':delete', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowStepService.dbModelApi.TAG + ':create', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowStepService.dbModelApi.TAG + ':update', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowStepService.dbModelApi.TAG + ':delete', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });

      // this.events.subscribe(this.workflowTransitionService.dbModelApi.TAG + ':create', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowTransitionService.dbModelApi.TAG + ':update', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.workflowTransitionService.dbModelApi.TAG + ':delete', (model) => {
      //   this.setExistModel();
      //   this.detectChanges();
      // });

      // this.events.subscribe(this.protocolCommentService.dbModelApi.TAG + ':create', async (model) => {
      //   this.model.comments = await this.protocolService.getComments(this.model);
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.protocolCommentService.dbModelApi.TAG + ':update', async (model) => {
      //   this.model.comments = await this.protocolService.getComments(this.model);
      //   this.detectChanges();
      // });
      // this.events.subscribe(this.protocolCommentService.dbModelApi.TAG + ':delete', async (model) => {
      //   this.model.comments = await this.protocolService.getComments(this.model);
      //   this.detectChanges();
      // });
    });

    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case this.protocolTemplateService.dbModelApi.TAG + ':update':
        case this.protocolTemplateService.dbModelApi.TAG + ':delete':
        case this.protocolService.dbModelApi.TAG + ':update':
        case this.protocolService.dbModelApi.TAG + ':delete':
        case this.protocolDefaultService.dbModelApi.TAG + ':update':
        case this.protocolDefaultService.dbModelApi.TAG + ':delete':
        case this.workflowService.dbModelApi.TAG + ':create':
        case this.workflowService.dbModelApi.TAG + ':update':
        case this.workflowService.dbModelApi.TAG + ':delete':
        case this.workflowStepService.dbModelApi.TAG + ':create':
        case this.workflowStepService.dbModelApi.TAG + ':update':
        case this.workflowStepService.dbModelApi.TAG + ':delete':
        case this.workflowTransitionService.dbModelApi.TAG + ':create':
        case this.workflowTransitionService.dbModelApi.TAG + ':update':
        case this.workflowTransitionService.dbModelApi.TAG + ':delete':
          this.setExistModel();
          this.detectChanges();
          break;
        case this.protocolCommentService.dbModelApi.TAG + ':create':
        case this.protocolCommentService.dbModelApi.TAG + ':update':
        case this.protocolCommentService.dbModelApi.TAG + ':delete':
          this.model.comments = await this.protocolService.getComments(this.model);
          this.detectChanges();
          break;
        default:
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
