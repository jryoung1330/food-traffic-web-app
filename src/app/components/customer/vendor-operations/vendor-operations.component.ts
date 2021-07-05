import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { VendorService } from 'src/app/services/vendor.service';
import { Error } from 'src/entities/error';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';

@Component({
  selector: 'app-vendor-operations',
  templateUrl: './vendor-operations.component.html',
  styleUrls: ['./vendor-operations.component.css']
})
export class VendorOperationsComponent implements OnInit {

  @Input('op') op: OperationItem;
  editText: boolean = false;

  constructor(public dialog: MatDialog, private vendorService: VendorService) {}

  ngOnInit(): void {}

  capitalCase(str: String) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  pad(num: String, size: number) {
    while (num.length < size) num = "0" + num;
    return num;
  }

  convert12Hour(num: number) {
    return num > 12 ? num - 12 : num;
  }

  getTimeOfDay(num: number) {
    return num >= 12 ? 'PM' : 'AM';
  }

  convertTime(time: String) {
    const hours = this.convert12Hour(+time.substr(0, time.indexOf(":")));
    const minutes = this.pad(time.substr(time.indexOf(":") + 1), 2);
    return hours + ':' + minutes + ' ' + this.getTimeOfDay(+time.substr(0, time.indexOf(":")));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OperationEditDialog, {
      width: '25rem',
      data: this.op
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && this.validateTime(result.open) && this.validateTime(result.close)) {
        result.openTime = result.open.toString();
        result.closeTime = result.close.toString();
        this.vendorService.updateOperationItem(window.location.pathname, this.op).subscribe((payload) => {
          console.log(payload);
          this.op = payload;
        });
      }
    });
  }

  // TODO: set up form validation
  validateTime(time: Time): boolean {
    let hours = Number.parseInt(time.hours);
    let minutes = Number.parseInt(time.minutes);

    if(hours < 0 || hours > 12) {
      console.log('Invalid hours');
      return false;
    }

    if(minutes < 0 || minutes > 59) {
      console.log("Invalid minutes");
      return false;
    }

    return true;
  }
}

@Component({
  selector: 'operation-edit-dialog',
  templateUrl: 'operation-edit-dialog.html',
  styleUrls: ['./vendor-operations.component.css']
})
export class OperationEditDialog {
  constructor(
    public dialogRef: MatDialogRef<OperationEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OperationItem) {
      this.data.open = new Time();
      this.data.open.splitTime(this.data.openTime);
      this.data.close = new Time();
      this.data.close.splitTime(this.data.closeTime);
    }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  capitalCase(str: String) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}