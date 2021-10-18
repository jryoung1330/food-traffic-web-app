import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperationService } from 'src/app/services/operation.service';
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

  constructor(public dialog: MatDialog, private opService: OperationService) {}

  ngOnInit(): void {}

  capitalCase(str: String) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
      if(result !== undefined && this.opService.validateTime(result.open) && this.opService.validateTime(result.close)) {
        result.openTime = result.open.toString();
        result.closeTime = result.close.toString();
        this.opService.updateOperationItem(window.location.pathname, this.op).subscribe((payload) => {
          this.op = payload;
        });
      }
    });
  }
}
