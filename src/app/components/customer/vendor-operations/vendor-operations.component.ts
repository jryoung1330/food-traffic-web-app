import { Component, Input, OnInit } from '@angular/core';
import { OperationItem } from 'src/entities/operationItem';

@Component({
  selector: 'app-vendor-operations',
  templateUrl: './vendor-operations.component.html',
  styleUrls: ['./vendor-operations.component.css']
})
export class VendorOperationsComponent implements OnInit {

  @Input('op') op: OperationItem;
  editText: boolean = false;

  constructor() {}

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
}