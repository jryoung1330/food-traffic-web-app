import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperationService } from 'src/app/services/operation.service';
import { OperationItem } from 'src/entities/operationItem';
import { OperationDialog } from './operation-dialog/operation-dialog.component';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  @Input('op') op: OperationItem;
  @Input('isList') isList: boolean;
  @Input('mode') mode: string;
  editText: boolean = false;
  days: string[];

  constructor(public dialog: MatDialog, private opService: OperationService) {
    this.days = opService.getDays();
  }

  ngOnInit(): void {}

  capitalCase(str: String) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  isToday() {
    return this.op.dayOfWeek.toUpperCase() === this.days[new Date().getDay()];
  }

  setEditMode(on: boolean) {
    if(this.mode == 'VENDOR') {
      this.editText = on;
    }
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
