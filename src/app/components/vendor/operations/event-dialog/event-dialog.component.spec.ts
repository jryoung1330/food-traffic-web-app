import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDialog } from './event-dialog.component';

describe('EventDialogComponent', () => {
  let component: EventDialog;
  let fixture: ComponentFixture<EventDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
