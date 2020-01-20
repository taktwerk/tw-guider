import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  // styleUrls: './progress-bar.component.scss',
  providers: []
})
export class ProgressBarComponent {

  @Input('progress') progress;

  constructor() {

  }

}
