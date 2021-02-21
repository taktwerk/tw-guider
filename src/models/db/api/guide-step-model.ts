import { LoggerService } from './../../../services/logger-service';
import { Platform } from '@ionic/angular';
import { DbApiModel, FileMapInModel } from '../../base/db-api-model';
import { DbProvider } from '../../../providers/db-provider';
import { DbBaseModel } from '../../base/db-base-model';
import { DownloadService } from '../../../services/download-service';
import { GuiderModel } from './guider-model';
import { MiscService } from 'src/services/misc-service';

/**
 * API Db Model for 'Guider Model'.
 */
export class GuideStepModel extends DbApiModel {
    /** @inheritDoc */
    TAG: string = 'GuideStepModel';
    public apiPk = 'id';

    //members
    public guide_id: number;
    public order_number: number;
    public title: string;
    public description_html: string;
    public attached_file: string;
    public local_attached_file: string;
    public local_guide_id: number;
    public design_canvas_meta: string;

    //db columns
    static COL_GUIDE_ID = 'guide_id';
    static COL_ORDER_NUMBER = 'order_number';
    static COL_TITLE = 'title';
    static COL_DESCRIPTION_HTML = 'description_html';
    static COL_ATTACHED_FILE = 'attached_file';
    static COL_API_ATTACHED_FILE_PATH = 'attached_file_path';
    static COL_LOCAL_ATTACHED_FILE = 'local_attached_file';
    static COL_THUMB_ATTACHED_FILE = 'thumb_attached_file';
    static COL_API_THUMB_ATTACHED_FILE_PATH = 'thumb_attached_file_path';
    static COL_LOCAL_THUMB_ATTACHED_FILE = 'local_thumb_attached_file';
    static COL_LOCAL_GUIDE_ID = 'local_guide_id';
    static COL_DESIGN_CANVAS_META = "design_canvas_meta";

    public downloadMapping: FileMapInModel[] = [
        {
            name: GuideStepModel.COL_ATTACHED_FILE,
            url: GuideStepModel.COL_API_ATTACHED_FILE_PATH,
            localPath: GuideStepModel.COL_LOCAL_ATTACHED_FILE,
            thumbnail: {
                name: GuideStepModel.COL_THUMB_ATTACHED_FILE,
                url: GuideStepModel.COL_API_THUMB_ATTACHED_FILE_PATH,
                localPath: GuideStepModel.COL_LOCAL_THUMB_ATTACHED_FILE
            }
        },
        {
            name: GuideStepModel.COL_THUMB_ATTACHED_FILE,
            url: GuideStepModel.COL_API_THUMB_ATTACHED_FILE_PATH,
            localPath: GuideStepModel.COL_LOCAL_THUMB_ATTACHED_FILE
        }
    ];

    /** @inheritDoc */
    TABLE_NAME: string = 'guide_step';

    /** @inheritDoc */
    TABLE: any = [
        [GuideStepModel.COL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideStepModel.COL_ORDER_NUMBER, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideStepModel.COL_TITLE, 'VARCHAR(45)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_DESCRIPTION_HTML, 'TEXT', DbBaseModel.TYPE_STRING],
        /// attached file columns
        [GuideStepModel.COL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_API_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_LOCAL_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        /// thumb attached file columns
        [GuideStepModel.COL_THUMB_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_API_THUMB_ATTACHED_FILE_PATH, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_LOCAL_THUMB_ATTACHED_FILE, 'VARCHAR(255)', DbBaseModel.TYPE_STRING],
        [GuideStepModel.COL_LOCAL_GUIDE_ID, 'INT', DbBaseModel.TYPE_NUMBER],
        [GuideStepModel.COL_DESIGN_CANVAS_META, 'LONGTEXT', DbBaseModel.TYPE_STRING]
    ];

    /**
     * @inheritDoc
     */
    constructor(public platform: Platform, public db: DbProvider, public downloadService: DownloadService,
        public loggerService: LoggerService,
        public miscService: MiscService,
    ) {
        super(platform, db, downloadService, loggerService, miscService);
    }

    async updateLocalRelations() {
        if (!this[this.COL_ID] || !this.idApi) {
            return;
        }

        const guiderModel = new GuiderModel(this.platform, this.db, this.downloadService, this.loggerService, this.miscService);
        if (guiderModel) {
            const guiderModels = await guiderModel.findFirst(
                [guiderModel.COL_ID_API, this.guide_id]
            );
            if (guiderModels && guiderModels.length) {
                const guider = guiderModels[0];
                if (guider) {
                    this.local_guide_id = guider[guider.COL_ID];
                    await this.save(false, true);
                }
            }
        }
    }

    public migrations = ['AddLocalGuideIdToGuideStepTableMigration', 'AddDesignCanvasMetaToGuideStepTableMigration'];

    async beforePushDataToServer(isInsert?: boolean) {
        if (isInsert) {
            if (!this[this.COL_ID]) {
                return;
            }
            const guiderModel = new GuiderModel(this.platform, this.db, this.downloadService, this.loggerService, this.miscService);
            const guiderModels = await guiderModel.findFirst([guiderModel.COL_ID, this.local_guide_id]);
            if (guiderModels && guiderModels.length) {
                console.log('guiderModels is not 0000');
                const guider = guiderModels[0];
                if (guider) {
                    this.guide_id = guider.idApi;
                    const isSaved = await this.save(false, false);
                }
            }
        }
    }
}
