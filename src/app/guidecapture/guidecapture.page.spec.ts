import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuidecapturePage } from './guidecapture.page';

describe('GuidecapturePage', () => {
  let component: GuidecapturePage;
  let fixture: ComponentFixture<GuidecapturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidecapturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuidecapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
