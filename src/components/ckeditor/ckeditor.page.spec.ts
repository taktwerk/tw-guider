import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CKEditorPage } from './ckeditor.page';

describe('CKEditorPage', () => {
  let component: CKEditorPage;
  let fixture: ComponentFixture<CKEditorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CKEditorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CKEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
