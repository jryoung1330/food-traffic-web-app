import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationDialog } from './operation-dialog.component';

describe('OperationDialogComponent', () => {
  let component: OperationDialog;
  let fixture: ComponentFixture<OperationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
