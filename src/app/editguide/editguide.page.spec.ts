import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditguidePage } from './editguide.page';
import { IonicModule } from '@ionic/angular';

describe('EditguidePage', () => {
  let component: EditguidePage;
  let fixture: ComponentFixture<EditguidePage>;

  beforeEach(waitForAsync(() => {
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
