import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTagCardComponent } from './vendor-tag-card.component';

describe('VendorTagCardComponent', () => {
  let component: VendorTagCardComponent;
  let fixture: ComponentFixture<VendorTagCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorTagCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorTagCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
