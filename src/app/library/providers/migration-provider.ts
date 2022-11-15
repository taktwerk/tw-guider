/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */

import * as migrationList from '../../database/migrations/base/migration-list';
import { FeedbackService } from './api/feedback-service';
import { GuideAssetPivotService } from './api/guide-asset-pivot-service';
import { GuideAssetService } from './api/guide-asset-service';
import { GuideCategoryBindingService } from './api/guide-category-binding-service';
import { GuideCategoryService } from './api/guide-category-service';
import { GuideChildService } from './api/guide-child-service';
import { GuideStepService } from './api/guide-step-service';
import { GuideViewHistoryService } from '../providers/api/guide-view-history-service';
import { GuiderService } from './api/guider-service';
import { Injectable } from '@angular/core';
import { MigrationService } from '../providers/api/migration-service';
import { ProtocolCommentService } from './api/protocol-comment-service';
import { ProtocolDefaultService } from './api/protocol-default-service';
import { ProtocolService } from './api/protocol-service';
import { ProtocolTemplateService } from './api/protocol-template-service';
import { SyncIndexService } from './api/sync-index-service';
import { WorkflowService } from './api/workflow-service';
import { WorkflowStepService } from './api/workflow-step-service';
import { WorkflowTransitionService } from './api/workflow-transition-service';
import { AuthDb } from 'app/database/models/db/auth-db';

@Injectable()
export class MigrationProvider {

  constructor(
    private migration: MigrationService,
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
    private syncIndexService: SyncIndexService,
    private authDb: AuthDb,
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
    sync_index: this.syncIndexService,
  };

  async init() {
    const isExistMigrationTable = await this.migration.dbModelApi.isExistTable();
    if (!isExistMigrationTable) {
      await this.migration.dbModelApi.dbCreateTable();
    }
    await this.addMigrations();
    await this.executeMigrations();
  }

  // update auth migration
  async checkAuthMigration() {
    // auth group column exist?
    // check auth table exist == safety check
    this.migration.dbModelApi.checkTableExit('auth').then(async (tableRes:any) => {
      // check all auth TABLE attributes exist
      // get migrations list
      const migrations = this.authDb.migrations;
      migrations.map(async (m, i) => {
        const migrationInstance = new (migrationList as any)[m](this.authDb);
        // execute migration
        const isExecutedMigration = await migrationInstance.execute();
        // console.log('Auth isExecutedMigration ', isExecutedMigration);
      });

      // re-authenticate user previous with authentication data
      // get username and password
      // const auth = await this.authService.getLastUser();
      // console.log('Auth ', auth);
      // console.log('username', auth.username);
      // console.log('password', auth.password);
      // const form = { username: auth.username, password: auth.password }

      // if (this.network.type === 'none' && !this.appSetting.isEnabledUsb) {
      //   this.authService.offlineAuthenticate(form).then((result) => {
      //     if (!result) {
      //       console.log('validation.Wrong password or login!');
      //     } else {
      //       console.log('login.You are logged in after migration.');
      //     }
      //   });
      // }
      // else {
      //   this.authService.authenticate(form).then((result: number) => {
      //     switch (result) {
      //       case AuthService.STATE_ERROR_NETWORK:
      //         // network problem
      //         break;
      //       case AuthService.STATE_ERROR_INVALID_LOGIN:
      //         // invalid login
      //         break;
      //       case AuthService.STATE_ERROR_USER_BLOCKED:
      //         console.log('validation.user_blocked');
      //         break;
      //       case AuthService.STATE_ERROR_USER_CANT_LOGIN:
      //         console.log('validation.user_cant_login');
      //         break;
      //       default:
      //         console.log('login.You are logged in.');
      //     }
      //   });
      // }
    });
  }

  async addMigrations() {
    const migrationModels: any = [];
    Object.keys(this.modelsServices).forEach(async (modelKey) => {
      const service = this.modelsServices[modelKey];
      let modelMigrations: any;
      if (service.TAG === 'AuthDb') {
        modelMigrations = service.migrations;
      }
      else {
        modelMigrations = service.dbModelApi.migrations;
      }
      let tableName: any;
      if (service.TAG === 'AuthDb') {
        tableName = service.TABLE_NAME;
      }
      else {
        tableName = service.dbModelApi.TABLE_NAME;
      }

      if (modelMigrations.length) {
        Object.keys(modelMigrations).forEach(async (migrationKey) => {
          const migrationName = modelMigrations[migrationKey];
          migrationModels.push({ migrationName: modelMigrations[migrationKey], tableName });
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
        await migrationModel.save();
      }
    }
  }

  async executeMigrations() {
    const dbServices:any = [];
    Object.keys(this.modelsServices).forEach(async (modelKey) => { dbServices.push(this.modelsServices[modelKey]); });

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
      const className:any = migrations[i].name;

      let isExecutedMigration = false;

      if ((migrationList as any)[className]) {
        const service = this.modelsServices[migrations[i].table_name];
        const migrationInstance = new (migrationList as any)[className](service);
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

      this.migration.dbModelApi.searchAll(condition).then((res: any) => {
        resolve(res);
        // console.log("this.migration.dbModelApi.searchAll", res);
      })
        .catch((err: any) => {
          console.log('this.migration.dbModelApi.searchAll Error ', err);
          resolve([]);
        });
    });
  }
}
