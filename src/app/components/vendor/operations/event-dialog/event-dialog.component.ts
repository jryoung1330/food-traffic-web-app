import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/components/confirmation/confirmation.component';
import { OperationService } from 'src/app/services/operation.service';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';

const DELETE = 'DELETE';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialog implements OnInit {

  editMode: boolean;
  opItem: OperationItem;
  events: OperationItem[];

  ngOnInit(): void { }

  constructor(
    public dialogRef: MatDialogRef<EventDialog>,
    public dialog: MatDialog,
    public opService: OperationService,
    public eventDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.editMode = data.editMode;
     
      if(data.opItem) {
        this.opItem = data.opItem;
        this.addTimeToOpItem(this.opItem);
      } else if(data.events) {
        this.events = data.events;
        this.events.forEach((event) => {
          this.addTimeToOpItem(event);
        });
      }
    }
  
  addTimeToOpItem(op: OperationItem) {
    op.open = new Time();
    op.close = new Time();
    
    if(op.openTime) {
      op.open.splitTime(op.openTime);
    }

    if(op.closeTime) {
      op.close.splitTime(op.closeTime);
    }
  }

  // @click
  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  // @click
  save(data: OperationItem): void {
    this.dialogRef.close(data);
  }

  // @click
  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '25%',
      data: "Are you sure you want to delete event: " + this.data.eventName + "?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dialogRef.close(DELETE);
      }
    });
  }

  // @click
  createEvent() {
    const dialogRef = this.eventDialog.open(EventDialog, {
      width: '35%',
      height: '45%',
      data: {
        opItem: this.opItem,
        editMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.opService.handleCreate(result, Number.parseInt(localStorage.getItem('vendor')), window.location.pathname)
          .subscribe((payload) => {
            this.opService.getEventsForMonthSub(window.location.pathname, new Date());
            if(this.events.length > 0) {
              this.events.push(payload);
            } else {
              this.opItem = payload;
            }
          });
      }
    });
  }
}
