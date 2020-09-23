import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProtocolModel} from '../../../models/db/api/protocol-model';
import {ProtocolService} from '../../../providers/api/protocol-service';
import {ProtocolDefaultService} from '../../../providers/api/protocol-default-service';
import {ProtocolDefaultModel} from '../../../models/db/api/protocol-default-model';
import {DownloadService} from '../../../services/download-service';
import {AlertController, Events} from '@ionic/angular';
import {TranslateConfigService} from '../../../services/translate-config.service';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'protocol-default-component',
  templateUrl: 'protocol-default-component.html',
  styleUrls: ['protocol-default-component.scss']
})

export class ProtocolDefaultComponent implements OnInit, OnDestroy {

    @Input() protocol: ProtocolModel;
    @Input() protocol_form: ProtocolDefaultModel;
    @Input() isInsert: boolean;

    public params;

    constructor(private protocolService: ProtocolService,
                private protocolDefaultService: ProtocolDefaultService,
                private downloadService: DownloadService,
                public events: Events,
                public alertController: AlertController,
                private translateConfigService: TranslateConfigService) {
        //
    }

    public async editProtocolFile() {
        console.log('editProtocolFile this.isInsert', this.isInsert);
        if (this.isInsert) {
            if (!this.protocol_form[ProtocolDefaultModel.COL_LOCAL_PROTOCOL_FILE]) {
                this.protocolDefaultService.openCreatePage(
                    this.protocol.protocol_template_id,
                    this.protocol.client_id,
                    this.protocol.reference_model,
                    this.protocol.reference_id
                );
                return;
            }
        } else if (!this.protocol_form) {
            const protocolFormModel = await this.protocolDefaultService['dbModelApi'].findFirst(
                [this.protocolDefaultService['dbModelApi'].COL_ID, this.protocol.local_protocol_form_number]
            );
            console.log('this.protocol.local_protocol_form_number', this.protocol.local_protocol_form_number);
            if (!protocolFormModel || !protocolFormModel[0]) {
                return;
            }
            this.protocol_form = protocolFormModel[0];
        }
        console.log('editProtocolFile this.protocol_form', this.protocol_form);
        this.protocolDefaultService.openEditPage(this.protocol_form, this.protocol);
    }

    async showSaveFilePopup(saveInformation) {
        const alert = await this.alertController.create({
            message: this.translateConfigService.translateWord('synchronization-component.Are you sure you want to overwrite the data?'),
            buttons: [
                {
                    text: 'Yes',
                    cssClass: 'primary',
                    handler: () => this.updateProtocolFile(saveInformation)
                }, {
                    text: 'No',
                }
            ]
        });
        await alert.present();
    }

    updateProtocolFile(saveInformation) {
        console.log('saveInformation', saveInformation);
        this.downloadService.copy(saveInformation.protocol_file, this.protocol_form.TABLE_NAME).then(async (savedFilePath) => {
            const modelFileMap = this.protocol_form.downloadMapping[saveInformation.fileMapIndex];
            console.log('savedFilePath', savedFilePath);
            this.protocol_form[modelFileMap.url] = '';
            this.protocol_form[modelFileMap.localPath] = savedFilePath;
            this.protocol_form[modelFileMap.name] = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1, savedFilePath.length);
            console.log('this.protocol_form in copy file', this.protocol_form);
        });
    }

    ngOnInit(): void {
        console.log('protocolDefaultService componennt init');
        this.events.subscribe('pdfWasSaved', () => {
            const saveInformation = this.protocolDefaultService.saveInformation;
            this.showSaveFilePopup(saveInformation);
        });
    }

    ngOnDestroy(): void {
        this.events.unsubscribe('pdfWasSaved');
    }
}
