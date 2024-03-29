import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/components/confirmation/confirmation.component';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.css']
})
export class OperationDialog implements OnInit {

  ngOnInit(): void {
  }

  constructor(
    public dialogRef: MatDialogRef<OperationDialog>,
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
    if(data.event) {
      this.openDialog();
    }
    this.dialogRef.close(data);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '25%',
      data: "This is an event. Are you sure you want to update it?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dialogRef.close(this.data);
      } else {
        this.onNoClick();
      }
    });
  }

}
