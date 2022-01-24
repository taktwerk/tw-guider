/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { ModalController, Platform } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'text-editor',
  templateUrl: './ckeditor.page.html',
  styleUrls: ['./ckeditor.page.scss'],
})
export class CKEditorComponent implements OnInit {
  public Editor = ClassicEditor;

  @Input() content;
  ckeditorContent;
  ckeConfig;

  constructor(
    public platform: Platform,
    private storage: Storage,
     private modalController: ModalController) { }

  ngOnInit() {
    this.ckeditorContent = this.content || '';
    this.ckeConfig = {
      toolbar: ['heading', 'bold', 'italic', 'blockQuote', 'numberedList', 'bulletedList', 'insertTable'],
      toolbarLocation: 'bottom',
    };
  }

  ionViewDidEnter() {
    this.storage.set('CKEditorComponentOpen', true);
  }

  async onDone() {
    await this.modalController.dismiss({ data: this.ckeditorContent });
    this.storage.set('CKEditorComponentOpen', false);
  }
}
