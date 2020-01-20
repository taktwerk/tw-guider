import { Component } from '@angular/core';
import {Guide} from '../../entities/guide';
import {GuideStep} from '../../entities/guide_step';
import { getRepository, Repository } from 'typeorm';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

}
