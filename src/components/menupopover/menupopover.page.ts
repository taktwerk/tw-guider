import { Component, OnInit } from '@angular/core';
import { ApiSync } from 'src/providers/api-sync';

@Component({
  selector: 'app-menupopover',
  templateUrl: './menupopover.page.html',
  styleUrls: ['./menupopover.page.scss'],
})
export class MenuPopoverComponent implements OnInit {
  constructor(private apiSync: ApiSync) { }

  ngOnInit() { }

}
