import {Component, Input} from '@angular/core';
import {DbApiModel} from '../../models/base/db-api-model';

@Component({
  selector: 'default-file-preview-component',
  templateUrl: 'default-file-preview-component.html',
})
export class DefaultFilePreviewComponent {
    @Input() model: DbApiModel;

    constructor() {}
}
