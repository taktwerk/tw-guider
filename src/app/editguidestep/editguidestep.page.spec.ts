import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditguidestepPage } from './editguidestep.page';

describe('EditguidestepPage', () => {
  let component: EditguidestepPage;
  let fixture: ComponentFixture<EditguidestepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditguidestepPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditguidestepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
