import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'text-editor',
  templateUrl: './ckeditor.page.html',
  styleUrls: ['./ckeditor.page.scss'],
})
export class CKEditorComponent implements OnInit {
  @Input() content;
  ckeditorContent
  ckeConfig

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.ckeditorContent = this.content;

    this.ckeConfig = {
      toolbar: [{ name: "basicstyles", items: ["Format", "-", "Bold", "Italic", "Blockquote", "-", "NumberedList", "BulletedList", "-", "Table"] }],
      toolbarLocation: 'bottom',
      height: '100%',
      autoGrow_minHeight: '600',
    };
  }

  onChange(e) {
    console.log(this.ckeditorContent);
  }

  async onDone() {
    await this.modalController.dismiss({ data: this.ckeditorContent });
  }
}
