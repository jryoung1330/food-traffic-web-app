import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/components/confirmation/confirmation.component';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';

const DELETE = 'DELETE';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialog implements OnInit {

  ngOnInit(): void {
  }

  constructor(
    public dialogRef: MatDialogRef<EventDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: OperationItem) {
      this.data.open = new Time();
      this.data.close = new Time();
      
      if(this.data.openTime) {
        this.data.open.splitTime(this.data.openTime);
      }

      if(this.data.closeTime) {
        this.data.close.splitTime(this.data.closeTime);
      }
    }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  save(data: OperationItem): void {
    this.dialogRef.close(data);
  }

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

}
