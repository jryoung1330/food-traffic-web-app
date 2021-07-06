import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTagComponent } from './vendor-tag.component';

describe('VendorTagComponent', () => {
  let component: VendorTagComponent;
  let fixture: ComponentFixture<VendorTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
