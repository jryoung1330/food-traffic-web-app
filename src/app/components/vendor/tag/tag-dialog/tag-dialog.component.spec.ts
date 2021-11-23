import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagDialog } from './tag-dialog.component';

describe('TagDialogComponent', () => {
  let component: TagDialog;
  let fixture: ComponentFixture<TagDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
