import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditguidePage } from './editguide.page';

describe('EditguidePage', () => {
  let component: EditguidePage;
  let fixture: ComponentFixture<EditguidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditguidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditguidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
