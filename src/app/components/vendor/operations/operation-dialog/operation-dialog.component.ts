import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

}
