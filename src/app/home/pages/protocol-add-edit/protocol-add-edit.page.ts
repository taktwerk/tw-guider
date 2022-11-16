/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/component-selector */

import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { Md5 } from 'ts-md5';
import { Subscription } from 'rxjs';

import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ProtocolTemplateModel } from 'app/database/models/db/api/protocol-template-model';
import { WorkflowTransitionModel } from 'app/database/models/db/api/workflow-transition-model';
import { ProtocolCommentService } from 'app/library/providers/api/protocol-comment-service';
import { ProtocolDefaultService } from 'app/library/providers/api/protocol-default-service';
import { ProtocolService } from 'app/library/providers/api/protocol-service';
import { ProtocolTemplateService } from 'app/library/providers/api/protocol-template-service';
import { WorkflowService } from 'app/library/providers/api/workflow-service';
import { WorkflowStepService } from 'app/library/providers/api/workflow-step-service';
import { WorkflowTransitionService } from 'app/library/providers/api/workflow-transition-service';
import { AuthService } from 'app/library/services/auth-service';
import { DownloadService } from 'app/library/services/download-service';
import { MiscService } from 'app/library/services/misc-service';
import { TranslateConfigService } from 'app/library/services/translate-config.service';
import { HttpClient } from 'app/library/services/http-client';

@Component({
  selector: 'protocol-add-edit',
  templateUrl: 'protocol-add-edit.page.html',
  styleUrls: ['protocol-add-edit.page.scss']
})
export class ProtocolAddEditPage implements OnInit, OnDestroy {
  public model = null;
  public protocolId = null;
  public reference_id = null;
  public reference_model: any = null;
  public reference_model_alias: any = null;
  public protocol_form: any;
  private templateId = null;
  private clientId = null;
  public comment: any = null;
  public params: any;

  faClock: IconProp = faClock as IconProp;
  faUser: IconProp = faUser as IconProp;

  eventSubscription?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
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
    private ngZone: NgZone,
    private translateConfigService: TranslateConfigService,
    private router: Router,
    private miscService: MiscService,

  ) {
    this.authService.checkAccess('protocol');
    this.comment = null;
    if (!this.model) {
      (this.model as any) = protocolService.newModel();
    }
  }

  dismiss() {
    (this.model as any).deleteAttachedFilesForDelete();

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
    this.changeDetectorRef.detectChanges();
  }

  public async save() {
    if ((!this.model as any)[(this.model as any).COL_ID]) {
      const protocolTemplate = await this.getProtocolTemplate(this.templateId as any);
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
      (this.model as any).client_id = this.clientId;
      (this.model as any).protocol_template_id = protocolTemplate.idApi;
      (this.model as any).workflow_step_id = workflowFirstStep.idApi;
      (this.model as any).protocol_form_number = 0;
      (this.model as any).protocol_form_table = this.protocol_form.TABLE_NAME;
      (this.model as any).reference_model = 'taktwerk\\yiiboilerplate' + this.reference_model;
      (this.model as any).reference_id = this.reference_id;
      (this.model as any).name = protocolName;
      (this.model as any).creator = this.getCreatorName();
      await (this.model as any).save();
      this.protocolId = (this.model as any)[(this.model as any).COL_ID];
      (this.model as any).workflowStep = await this.workflowStepService.getById((this.model as any).workflow_step_id);
      (this.model as any).canEditProtocol = await this.protocolService.canEditProtocol(this.model as any);
      (this.model as any).canFillProtocol = await this.protocolService.canFillProtocol(this.model as any);
      if (!this.protocol_form.local_pdf_image) {
        this.protocol_form.local_pdf_image = await this.downloadService.copy(
          (protocolTemplate as any)[ProtocolTemplateModel.COL_LOCAL_PDF_IMAGE],
          this.protocol_form.TABLE_NAME
        );
      }
    }
    if ((this.model as any).idApi) {
      this.protocol_form.protocol_id = (this.model as any).idApi;
    }
    this.protocol_form.local_protocol_id = ((this.model as any) as any)[(this.model as any).COL_ID];
    const isSaved = await this.protocol_form.save();
    if (isSaved) {
      if (!this.protocol_form.idApi) {
        (this.model as any).local_protocol_form_number = this.protocol_form[this.protocol_form.COL_ID];
      }
      await (this.model as any).save();
      if (this.comment) {
        const protocolCommentModel = this.protocolCommentService.newModel();
        if ((this.model as any).idApi) {
          protocolCommentModel.protocol_id = (this.model as any).idApi;
        }
        protocolCommentModel.local_protocol_id = ((this.model as any) as any)[(this.model as any).COL_ID];
        protocolCommentModel.comment = this.comment;
        protocolCommentModel.event = 'comment';
        protocolCommentModel.name = 'a';
        protocolCommentModel.creator = this.getCreatorName();
        await protocolCommentModel.save();
        this.comment;
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
      if ((this.model as any).idApi) {
        writtenProtocolCommentModel.protocol_id = (this.model as any).idApi;
      }
      writtenProtocolCommentModel.local_protocol_id = ((this.model as any) as any)[(this.model as any).COL_ID];
      writtenProtocolCommentModel.comment = this.comment;
      writtenProtocolCommentModel.event = 'comment';
      writtenProtocolCommentModel.name = 'a';
      writtenProtocolCommentModel.creator = this.getCreatorName();
      await writtenProtocolCommentModel.save();
      this.comment;
    }
    const transitionProtocolCommentModel = this.protocolCommentService.newModel();
    if ((this.model as any).idApi) {
      transitionProtocolCommentModel.protocol_id = (this.model as any).idApi;
    }
    transitionProtocolCommentModel.local_protocol_id = ((this.model as any) as any)[(this.model as any).COL_ID];
    transitionProtocolCommentModel.event = (this.model as any).workflowStep.type;
    transitionProtocolCommentModel.old_workflow_step_id = nextWorkflowTransition.workflow_step_id;
    transitionProtocolCommentModel.new_workflow_step_id = nextWorkflowTransition.next_workflow_step_id;
    transitionProtocolCommentModel.name = 'b';
    transitionProtocolCommentModel.creator = this.getCreatorName();
    await transitionProtocolCommentModel.save();
    (this.model as any).workflow_step_id = nextWorkflowTransition.next_workflow_step_id;
    await (this.model as any).save();
    let previousProtocolFormFile = null;
    if (this.protocol_form.local_pdf_image) {
      previousProtocolFormFile = this.protocol_form.local_pdf_image;
    }
    const protocolFormService = this.protocolService.getProtocolFormService((this.model as any).protocol_form_table);
    this.protocol_form = protocolFormService?.newModel();

    if ((this.model as any).idApi) {
      this.protocol_form.protocol_id = (this.model as any).idApi;
    }
    this.protocol_form.local_protocol_id = ((this.model as any) as any)[(this.model as any).COL_ID];
    if (previousProtocolFormFile) {
      const savedFilePath = await this.downloadService.copy(previousProtocolFormFile, this.protocol_form.TABLE_NAME);
      const modelFileMap = this.protocol_form.downloadMapping[0];
      this.protocol_form[modelFileMap.url] = '';
      this.protocol_form[modelFileMap.localPath] = savedFilePath;
      this.protocol_form[modelFileMap.name] = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1, savedFilePath.length);
    }
    // return false;
    await this.protocol_form.save();

    (this.model as any).local_protocol_form_number = this.protocol_form[this.protocol_form.COL_ID];
    await (this.model as any).save();
    (this.model as any).workflowStep = await this.workflowStepService.getById((this.model as any).workflow_step_id);
    (this.model as any).canEditProtocol = await this.protocolService.canEditProtocol((this.model as any));
    (this.model as any).canFillProtocol = await this.protocolService.canFillProtocol((this.model as any));
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
          resolve (res);
        }
      });
    });
  }

  async getProtcolFormModel() {
    const protocolFormService = this.protocolService.getProtocolFormService((this.model as any).protocol_form_table);
    if (!protocolFormService) {
      return null;
    }
    if (!(this.model as any).local_protocol_form_number) {
      return protocolFormService.newModel();
    }
    const protocolFormModel = await protocolFormService.dbModelApi.findFirst(
      [protocolFormService.dbModelApi.COL_ID, (this.model as any).local_protocol_form_number]
    );
    if (!protocolFormModel || !protocolFormModel[0]) {
      return protocolFormService.newModel();
    }

    return protocolFormModel[0];
  }

  async setExistModel() {
    if (this.protocolId) {
      this.workflowStepService.unsetWorkflowStepsListCache();
      const result = await this.protocolService.dbModelApi.findFirst([(this.model as any).COL_ID, this.protocolId]);
      (this.model as any) = result[0];
      (this.model as any).workflowStep = await this.workflowStepService.getById((this.model as any).workflow_step_id);
      (this.model as any).canEditProtocol = await this.protocolService.canEditProtocol((this.model as any));
      (this.model as any).canFillProtocol = await this.protocolService.canFillProtocol((this.model as any));
      (this.model as any).comments = await this.protocolService.getComments((this.model as any));
      this.protocol_form = await this.getProtcolFormModel();
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      const protocolData: any = params;
      // console.log('protocol add edit page data', protocolData);
      (this.templateId as any) = +protocolData.templateId;
      (this.clientId as any) = +protocolData.clientId;
      (this.reference_id as any) = +protocolData.referenceId;
      this.reference_model_alias = protocolData.referenceModelAlias;
      this.reference_model = this.protocolService.dbModelApi.getReferenceModelByAlias(this.reference_model_alias);
      (this.protocolId as any) = +protocolData.protocolId;
      if (this.protocolId) {
        await this.setExistModel();
      } else {
        (this.model as any) = this.protocolService.newModel();
        (this.model as any).client_id = this.clientId;
        (this.model as any).protocol_template_id = this.templateId;
        (this.model as any).reference_id = this.reference_id;
        (this.model as any).reference_model = this.reference_model;
        (this.model as any).protocol_form_table = 'protocol_default';
        this.protocol_form = await this.getProtcolFormModel();
        (this.model as any).canEditProtocol = await this.protocolTemplateService.canCreateProtocol(this.templateId);
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
          (this.model as any).comments = await this.protocolService.getComments(this.model as any);
          this.detectChanges();
          break;
        default:
      }
    });
  }

  ngOnDestroy(): void {
    (this.eventSubscription as any).unsubscribe();
  }
}
