import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDialog } from './menu-dialog.component';

describe('MenuDialogComponent', () => {
  let component: MenuDialog;
  let fixture: ComponentFixture<MenuDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
