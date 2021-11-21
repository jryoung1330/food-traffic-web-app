import { Component, Input, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { OperationItem } from 'src/entities/operationItem';

@Component({
  selector: 'app-vendor-operations',
  templateUrl: './vendor-operations.component.html',
  styleUrls: ['./vendor-operations.component.css']
})
export class VendorOperationsComponent implements OnInit {

  @Input('op') op: OperationItem;
  days: string[];

  constructor(private opService: OperationService) {
    this.days = opService.getDays();
  }

  ngOnInit(): void {}

  capitalCase(str: String) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  isToday() {
    return this.op.dayOfWeek.toUpperCase() === this.days[new Date().getDay()];
  }
}