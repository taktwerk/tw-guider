import { Injectable } from '@angular/core';
import {AppSetting} from '../services/app-setting';
import {ApiService} from '../providers/api/base/api-service';

import {MigrationService} from '../providers/api/migration-service';

import {GuiderService} from './api/guider-service';
import {GuideCategoryService} from './api/guide-category-service';
import {GuideCategoryBindingService} from './api/guide-category-binding-service';
import {GuideStepService} from './api/guide-step-service';
import {GuideChildService} from './api/guide-child-service';
import {Network} from '@ionic-native/network/ngx';
import {GuideAssetService} from './api/guide-asset-service';
import {GuideAssetPivotService} from './api/guide-asset-pivot-service';
import {FeedbackService} from './api/feedback-service';
import {UserService} from '../services/user-service';
import {ProtocolTemplateService} from './api/protocol-template-service';
import {ProtocolService} from './api/protocol-service';
import {ProtocolDefaultService} from './api/protocol-default-service';
import {WorkflowService} from './api/workflow-service';
import {WorkflowStepService} from './api/workflow-step-service';
import {ProtocolCommentService} from './api/protocol-comment-service';
import {WorkflowTransitionService} from './api/workflow-transition-service';
import * as migrationList from '../migrations/base/migration-list';

@Injectable()
export class MigrationProvider {

  constructor(private migration: MigrationService,
        private userService: UserService,
        private guideService: GuiderService,
        private guideCategoryService: GuideCategoryService,
        private guideCategoryBindingService: GuideCategoryBindingService,
        private guideStepService: GuideStepService,
        private guideAssetService: GuideAssetService,
        private guideAssetPivotService: GuideAssetPivotService,
        private feedbackService: FeedbackService,
        private workflowService: WorkflowService,
        private workflowStepService: WorkflowStepService,
        private protocolTemplateService: ProtocolTemplateService,
        private protocolService: ProtocolService,
        private protocolDefaultService: ProtocolDefaultService,
        private protocolCommentService: ProtocolCommentService,
        private workflowTransitionService: WorkflowTransitionService,
        private guideChildService: GuideChildService) { }

  modelsServices: any = {
      guide: this.guideService,
      guide_category: this.guideCategoryService,
      guide_category_binding: this.guideCategoryBindingService,
      guide_step: this.guideStepService,
      guide_asset: this.guideAssetService,
      guide_asset_pivot: this.guideAssetPivotService,
      guide_child: this.guideChildService,
      protocol_template: this.protocolTemplateService,
      protocol: this.protocolService,
      protocol_default: this.protocolDefaultService,
      workflow: this.workflowService,
      workflow_step: this.workflowStepService,
      workflow_transition: this.workflowTransitionService,
      protocol_comment: this.protocolCommentService,
      feedback: this.feedbackService
  };


  async init() {
    const isExistMigrationTable = await this.migration.dbModelApi.isExistTable();
    if (!isExistMigrationTable) {
      await this.migration.dbModelApi.dbCreateTable();
    }
    await this.addMigrations();
    await this.executeMigrations();
  }

  async addMigrations() {
    const migrationModels = [];
    Object.keys(this.modelsServices).forEach(async (modelKey) => {
        const service: ApiService = this.modelsServices[modelKey];
        const modelMigrations = service.dbModelApi.migrations;
        const tableName = service.dbModelApi.TABLE_NAME;

        if (modelMigrations.length) {
          Object.keys(modelMigrations).forEach(async (migrationKey) => {
            const migrationName = modelMigrations[migrationKey];
            
            migrationModels.push(
              {
                migrationName: modelMigrations[migrationKey],
                tableName: tableName
              }
            );
          });
        }
    });

    for (let i = 0; i < migrationModels.length; i++) {
      const migrationName = migrationModels[i].migrationName;
      const tableName = migrationModels[i].tableName;
      const migrationModel = this.migration.newModel();
      const isExistsModel = await migrationModel.exists(
        ['1=1', ['name', migrationName], ['table_name', tableName]]
      );
      if (!isExistsModel) {
        migrationModel.name = migrationName;
        migrationModel.table_name = tableName;
        migrationModel.is_active = 0;
        const isSaved = await migrationModel.save();
      }
    }
  }

  async executeMigrations() {
    const dbServices = [];
    Object.keys(this.modelsServices).forEach(async (modelKey) => {
        dbServices.push(this.modelsServices[modelKey]);
    });
    for (let i = 0; i < dbServices.length; i++) {
      const service: ApiService = dbServices[i];
      const modelMigrations = service.dbModelApi.migrations;
      const tableName = service.dbModelApi.TABLE_NAME;
      const isExistModelTable = await service.dbModelApi.isExistTable();
      if (!isExistModelTable) {
        await service.dbModelApi.dbCreateTable();
        const migrations = await this.getNotActiveMigrations(tableName);
        for (let i = 0; i < migrations.length; i++) {
          migrations[i].is_active = 1;
          await migrations[i].save();
        }
      }
    }
    const migrations = await this.getNotActiveMigrations();
    for (let i = 0; i < migrations.length; i++) {
      const className = migrations[i].name;
      let isExecutedMigration = false;
      if (migrationList[className]) {
        const service = this.modelsServices[migrations[i].table_name];
        const migrationInstance = new migrationList[className](service);
        isExecutedMigration = await migrationInstance.execute();
      }
      if (isExecutedMigration) {
        migrations[i].is_active = 1;
        await migrations[i].save();
      }
    }
  }

  getNotActiveMigrations(tableName?: string): Promise<any[]> {
    return new Promise(async (resolve) => {

      const condition: any = ['1=1', ['is_active', 1], ['name', 'AddLocalGuideIdToGuideStepTableMigration']];
      if (tableName) {
        condition.push(['table_name', tableName]);
      }
      this.migration.dbModelApi.searchAll(condition).then((res) => {
          resolve(res);
        }).catch((err) => {
            resolve([]);
        });
    });
  }
}
