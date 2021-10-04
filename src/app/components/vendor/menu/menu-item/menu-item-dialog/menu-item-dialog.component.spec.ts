import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemDialog } from './menu-item-dialog.component';

describe('MenuItemDialogComponent', () => {
  let component: MenuItemDialog;
  let fixture: ComponentFixture<MenuItemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuItemDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
