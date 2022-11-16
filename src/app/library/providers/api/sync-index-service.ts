import { Injectable } from '@angular/core';
import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { AppSetting } from '../../services/app-setting';
import { SyncIndexModel } from 'app/database/models/db/api/sync-index-model';

@Injectable()
export class SyncIndexService extends ApiService {
  override data: SyncIndexModel[] = [];
  loadUrl: string = '/sync-index';
  dbModelApi: SyncIndexModel = new SyncIndexModel();

  /**
   * Constructor
   * @param http
   * @param p
   * @param db
   * @param authService
   * @param events
   * @param downloadService
   * @param appSetting
   */
  constructor(
    http: HttpClient,
    public authService: AuthService,
    public override appSetting: AppSetting,
  ) {
    super(http, appSetting);
    console.debug('SyncIndexService', 'initialized');
  }

  /**
   * Create a new instance of the service model
   * @returns {SyncIndexModel}
   */
  public override newModel() {
    return new SyncIndexModel();
  }

  // find model by
  public getById(id: any): Promise<any> {
    return new Promise(async (resolve) => {
      const user = await this.authService.getLastUser();
      if (!user) {
        resolve([]);
        return;
      }
      const whereCondition = [['id', id]];
      if (!user.isAuthority && user.client_id) {
        whereCondition.push(['client_id', user.client_id]);
      }
      this.dbModelApi.findFirst(whereCondition).then((result) => {
        resolve(result);
      });
    });
  }

  // return new list of models found in the sync index
  public async getSyncIndexModel(modelList: any[], modelName: any): Promise<any> {
    // extract models not yet synced with API
    const unsyncedModels = modelList.filter((m) => m.is_synced === 0);
    // extract models synced with API
    const syncedModels = modelList.filter((m) => m.is_synced === 1);

    return new Promise(async (resolve) => {
      if (modelName) {
        const user = await this.authService.getLastUser();
        if (!user) {
          return;
        }
        const entries: any[] = [];
        this.dbModelApi.dbReady().then((db) => {
          db.query('SELECT * FROM sync_index')
            .then((res: any) => {
              for (let i = 0; i < res.rows.length; i++) {
                entries.push(res.rows.item(i));
              }
            })
            .then(() => {
              const qResult = entries;
              if (qResult.length > 0) {
                const filteredForModelName = qResult.filter((m) => m.model === modelName && user.userId === m.user_id && m.deleted_at === null); // filter by modelName
                const filteredList = syncedModels.filter(
                  (m) => filteredForModelName.find(({ model_id }) => JSON.parse(model_id) === m.idApi) !== undefined
                ); // find model by id

                // console.log("filteredForModelName ", filteredForModelName);
                // console.log("filterList ", filteredList);
                // console.log("modelList ", modelList);
                // console.log("user id ", user);

                // return models contained within syncIndex and models not synced with API
                const syncIndexModelsAndUnsyncedModels = unsyncedModels.concat(filteredList);
                resolve(syncIndexModelsAndUnsyncedModels);
              }
            });
        });
      }
    });
  }
}
