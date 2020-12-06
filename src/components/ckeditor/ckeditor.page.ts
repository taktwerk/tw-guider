import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'text-editor',
  templateUrl: './ckeditor.page.html',
  styleUrls: ['./ckeditor.page.scss'],
})
export class CKEditorComponent implements OnInit {
  public Editor = ClassicEditor;

  @Input() content;
  ckeditorContent
  ckeConfig

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.ckeditorContent = this.content;

    this.ckeConfig = {
      toolbar: ["heading", "bold", "italic", "blockQuote", "numberedList", "bulletedList", "insertTable"],
      toolbarLocation: 'bottom',
    };
  }

  onChange(e) {
    console.log(this.ckeditorContent);
  }

  async onDone() {
    await this.modalController.dismiss({ data: this.ckeditorContent });
  }

  onReady(e) {

  }
}
