import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOperationsComponent } from './vendor-operations.component';

describe('VendorOperationsComponent', () => {
  let component: VendorOperationsComponent;
  let fixture: ComponentFixture<VendorOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorOperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
