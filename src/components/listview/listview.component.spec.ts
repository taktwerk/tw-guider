import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListviewComponent } from './listview.component';

describe('ListviewComponent', () => {
  let component: ListviewComponent;
  let fixture: ComponentFixture<ListviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
