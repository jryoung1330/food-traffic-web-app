import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';
import { OperationDialog } from './operation-dialog/operation-dialog.component';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  @Input('op') op: OperationItem;
  @Input('list') list: boolean;
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
    if(time != null) {
      const hours = this.convert12Hour(+time.substr(0, time.indexOf(":")));
      const minutes = this.pad(time.substr(time.indexOf(":") + 1), 2);
      return hours + ':' + minutes + ' ' + this.getTimeOfDay(+time.substr(0, time.indexOf(":")));
    } else {
      return '';
    }
  }

  isToday() {
    return this.op.dayOfWeek.toUpperCase() === DAYS[new Date().getDay()];
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OperationDialog, {
      width: '25%',
      height: '32%',
      data: this.op
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && this.validateTime(result.open) && this.validateTime(result.close)) {
        result.openTime = result.open.toString();
        result.closeTime = result.close.toString();
        this.vendorService.updateOperationItem(window.location.pathname, this.op).subscribe((payload) => {
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
