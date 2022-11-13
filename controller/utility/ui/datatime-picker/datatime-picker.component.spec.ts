import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatimePickerComponent } from './datatime-picker.component';

describe('DatatimePickerComponent', () => {
  let component: DatatimePickerComponent;
  let fixture: ComponentFixture<DatatimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatatimePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
