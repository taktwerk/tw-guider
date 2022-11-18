import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProtocolDefaultModel } from 'app/database/models/db/api/protocol-default-model';
import { ProtocolModel } from 'app/database/models/db/api/protocol-model';
import { ProtocolDefaultService } from 'app/library/providers/api/protocol-default-service';
import { ProtocolService } from 'app/library/providers/api/protocol-service';
import { DownloadService } from 'app/library/services/download-service';
import { MiscService } from 'app/library/services/misc-service';
import { TranslateConfigService } from 'app/library/services/translate-config.service';

@Component({
    selector: 'protocol-default-component',
    templateUrl: 'protocol-default-component.html',
    styleUrls: ['protocol-default-component.scss']
})

export class ProtocolDefaultComponent implements OnInit, OnDestroy {

    @Input() protocol: any = new ProtocolModel();
    @Input() protocol_form: ProtocolDefaultModel = new ProtocolDefaultModel();
    @Input() isInsert: boolean = false;

    public params: any;
    eventSubscription: Subscription = new Subscription;

    constructor(private protocolService: ProtocolService,
        private protocolDefaultService: ProtocolDefaultService,
        private downloadService: DownloadService,

        public alertController: AlertController,
        private translateConfigService: TranslateConfigService,
        private miscService: MiscService,
    ) {
        //

    }

    public async editProtocolFile() {
        console.log('editProtocolFile this.isInsert', this.isInsert);
        if (this.isInsert) {
            if (!(this.protocol_form as any)[ProtocolDefaultModel.COL_LOCAL_PDF_IMAGE]) {
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

    async showSaveFilePopup(saveInformation: any) {
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

    updateProtocolFile(saveInformation: any) {
        console.log('saveInformation', saveInformation);
        this.downloadService
            .copy(saveInformation.protocol_file, this.protocol_form.TABLE_NAME)
            .then(async (savedFilePath) => {
                console.log('saveInformation.fileMapIndex', saveInformation.fileMapIndex);
                const modelFileMap = this.protocol_form.downloadMapping[saveInformation.fileMapIndex];
                console.log('modelFileMap', modelFileMap);
                console.log('savedFilePath', savedFilePath);
                (this.protocol_form as any)[modelFileMap.url] = '';
                (this.protocol_form as any)[modelFileMap.localPath] = savedFilePath;
                (this.protocol_form as any)[modelFileMap.name] = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1, savedFilePath.length);
                console.log('this.protocol_form in copy file', this.protocol_form);
            });
    }

    ngOnInit(): void {
        console.log('protocolDefaultService componennt init');
        // this.events.subscribe('pdfWasSaved', () => {
        //     const saveInformation = this.protocolDefaultService.saveInformation;
        //     this.showSaveFilePopup(saveInformation);
        // });

        this.eventSubscription = this.miscService.events.subscribe(async (event) => {
            switch (event.TAG) {
                case 'pdfWasSaved':
                    const saveInformation = this.protocolDefaultService.saveInformation;
                    this.showSaveFilePopup(saveInformation);
                    break;
                default:
            }
        });
    }

    ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }
}
