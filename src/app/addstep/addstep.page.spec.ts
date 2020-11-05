import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddstepPage } from './addstep.page';

describe('AddstepPage', () => {
  let component: AddstepPage;
  let fixture: ComponentFixture<AddstepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddstepPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddstepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
