import { AuthDb } from 'src/models/db/auth-db';
import { GuideViewHistoryService } from 'src/providers/api/guide-view-history-service';
import { Injectable } from '@angular/core';
import { AppSetting } from '../services/app-setting';
import { ApiService } from '../providers/api/base/api-service';

import { MigrationService } from '../providers/api/migration-service';

import { GuiderService } from './api/guider-service';
import { GuideCategoryService } from './api/guide-category-service';
import { GuideCategoryBindingService } from './api/guide-category-binding-service';
import { GuideStepService } from './api/guide-step-service';
import { GuideChildService } from './api/guide-child-service';
import { Network } from '@ionic-native/network/ngx';
import { GuideAssetService } from './api/guide-asset-service';
import { GuideAssetPivotService } from './api/guide-asset-pivot-service';
import { FeedbackService } from './api/feedback-service';
import { UserService } from '../services/user-service';
import { ProtocolTemplateService } from './api/protocol-template-service';
import { ProtocolService } from './api/protocol-service';
import { ProtocolDefaultService } from './api/protocol-default-service';
import { WorkflowService } from './api/workflow-service';
import { WorkflowStepService } from './api/workflow-step-service';
import { ProtocolCommentService } from './api/protocol-comment-service';
import { WorkflowTransitionService } from './api/workflow-transition-service';
import * as migrationList from '../migrations/base/migration-list';

@Injectable()
export class MigrationProvider {

  constructor(
    private migration: MigrationService,
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
    private guideChildService: GuideChildService,
    private guideViewHistoryService: GuideViewHistoryService,
    private authDb: AuthDb
  ) { }

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
    feedback: this.feedbackService,
    guide_view_history: this.guideViewHistoryService,
    // auth: this.authDb
  };

  async init() {
    const isExistMigrationTable = await this.migration.dbModelApi.isExistTable();
    if (!isExistMigrationTable) {
      await this.migration.dbModelApi.dbCreateTable();
    }
    await this.addMigrations();
    await this.executeMigrations();

    // this.checkAuthMigration();
  }

  // update auth migration
  async checkAuthMigration() {
    // auth group column exist?
    // check auth table exist == safety check
    this.migration.dbModelApi.isExistTable().then(async res => {
      // check all auth TABLE attributes exist
      console.log(this.authDb.TABLE)

      // get migrations list
      const migrations = this.authDb.migrations;
      for (let i = 0; i < migrations.length; i++) {
        console.log("migrations[i]", migrations[i]);
        let isExecutedMigration = false;
        // console.log(migrationList[migrations[i]]);

        if (migrationList[migrations[i]]) {
          const migrationInstance = new migrationList[migrations[i]](this.authDb);
          isExecutedMigration = await migrationInstance.execute();
        }

        if (isExecutedMigration) {
          // migrations[i].is_active = 1;
          await this.authDb.save();
        }
      }
      // this.authDb.TABLE.map(async c => {
      //   const groupColExit = await this.migration.dbModelApi.isExitColInTable('auth', c[0]);
      //   console.log("groupColExit ", groupColExit, c[0])
      // })
    })
  }

  async addMigrations() {
    const migrationModels = [];
    Object.keys(this.modelsServices).forEach(async (modelKey) => {
      const service = this.modelsServices[modelKey];
      let modelMigrations;
      if (service.TAG === 'AuthDb') {
        modelMigrations = service.migrations;
      }
      else {
        modelMigrations = service.dbModelApi.migrations;
      }
      let tableName;
      if (service.TAG === 'AuthDb') {
        tableName = service.TABLE_NAME;
      }
      else {
        tableName = service.dbModelApi.TABLE_NAME;
      }

      if (modelMigrations.length) {
        Object.keys(modelMigrations).forEach(async (migrationKey) => {
          const migrationName = modelMigrations[migrationKey];
          migrationModels.push({ migrationName: modelMigrations[migrationKey], tableName: tableName });
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
    Object.keys(this.modelsServices).forEach(async (modelKey) => { dbServices.push(this.modelsServices[modelKey]) });

    for (let i = 0; i < dbServices.length; i++) {
      const service = dbServices[i];

      let modelMigrations;

      if (service.TAG === 'AuthDb') {
        modelMigrations = service.migrations;
      }
      else {
        modelMigrations = service.dbModelApi.migrations;
      }

      let tableName;
      let isExistModelTable;

      if (service.TAG === 'AuthDb') {
        tableName = service.TABLE_NAME;
        isExistModelTable = await service.isExistTable();
      }
      else {
        tableName = service.dbModelApi.TABLE_NAME;
        isExistModelTable = await service.dbModelApi.isExistTable();
      }

      if (!isExistModelTable) {
        if (service.TAG === 'AuthDb') {
          await service.dbCreateTable();
        }
        else {
          await service.dbModelApi.dbCreateTable();
        }

        const migrations = await this.getNotActiveMigrations(tableName);
        for (let i = 0; i < migrations.length; i++) {
          migrations[i].is_active = 1;
          await migrations[i].save();
        }
      }
    }

    const migrations = await this.getNotActiveMigrations();
    // console.log("this.getNotActiveMigrations(); ", migrations)
    // console.log("Length of migration list seems to 0 for some reason")

    for (let i = 0; i < migrations.length; i++) {
      // console.log(migrations[i])
      const className = migrations[i].name;

      let isExecutedMigration = false;

      if (migrationList[className]) {
        const service = this.modelsServices[migrations[i].table_name];
        const migrationInstance = new migrationList[className](service);
        // console.log("migrationInstance ", migrationInstance);
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
        // console.log("this.migration.dbModelApi.searchAll", res);
      })
        .catch((err) => {
          console.log("this.migration.dbModelApi.searchAll Error ", err)
          resolve([]);
        });
    });
  }
}
