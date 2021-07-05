import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMenuItemComponent } from './vendor-menu-item.component';

describe('VendorMenuItemComponent', () => {
  let component: VendorMenuItemComponent;
  let fixture: ComponentFixture<VendorMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMenuItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
