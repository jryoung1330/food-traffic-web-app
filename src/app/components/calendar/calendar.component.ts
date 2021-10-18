import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';

const MILLISECONS_TO_HOURS : number = 36000000;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  todaysDate = new Date();
  month: Date[][] = [];
  monthName: String;
  currentDate: Date = new Date();
  @Input('vendor') vendor: Vendor;
  @Input('events') events: OperationItem[];

  constructor(private vendorService: VendorService, public eventDialog: MatDialog) { }

  ngOnInit(): void {
    this.month = this.generateMonth(this.currentDate);

    this.vendorService.events$.subscribe((payload) => {
      this.events = this.convertOperations(payload);
      this.month = this.generateMonth(this.currentDate);
    });
  }

  prevMonth() {
    this.currentDate = this.addNDays(this.getStartOfMonth(this.currentDate), -1);
    this.vendorService.getEventsForMonthSub(window.location.pathname, this.currentDate);
  }

  nextMonth() {
    this.currentDate = this.addNDays(this.getEndOfMonth(this.currentDate), 1);
    this.vendorService.getEventsForMonthSub(window.location.pathname, this.currentDate);
  }

  generateMonth(date: Date): Date[][] {
    let month: Date[][] = [];
    month[0] = [];
    month[1] = [];
    month[2] = [];
    month[3] = [];
    month[4] = [];
 
    let startOfMonth: Date = this.getStartOfMonth(date);
    let endOfMonth: Date = this.getEndOfMonth(date);

    this.monthName = this.months[startOfMonth.getMonth()];
 
    let day: Date = startOfMonth;
    let count: number = 1;
 
    for(let i=0; i<7; i++) {
      if(((day.getDay() + 6) % 7) === i) {
       month[0][i] = new Date(day);
       day = this.addNDays(day, 1);
       count++;
      }
    }
 
    for(let j=1; j<month.length; j++) {
     for(let k=0; k<7; k++) {
       month[j][k] = new Date(day);
       day = this.addNDays(day, 1);
       count++;
       if(k === 6 && count < endOfMonth.getDate()) {
         month[j+1] = [];
       }
     }
    }
 
   return month;
   }
 
   addNDays(day: Date, n: number) : Date {
     day.setDate(day.getDate() + n);
     return day;
   }
 
   getStartOfMonth(date: Date) : Date {
     let startOfMonth = new Date(date);
     startOfMonth.setDate(startOfMonth.getDate() - startOfMonth.getDate() + 1);
     return startOfMonth;
   }
 
   getEndOfMonth(date: Date) : Date {
     let endOfMonth = this.getStartOfMonth(date);
     endOfMonth.setMonth(endOfMonth.getMonth() + 1);
     endOfMonth.setDate(endOfMonth.getDate() - endOfMonth.getDate());
     return endOfMonth;
   }

  convertOperations(operationItems: OperationItem[]) {
    let now = new Date();
    operationItems.forEach(op => {
      if(!op.closed) {
        let closeTime = new Date();
        closeTime.setHours(this.getHours(op.closeTime), this.getMinutes(op.closeTime), 0, 0);
        op.closeDateTime = closeTime;
        op.timeLeft = (op.closeDateTime.valueOf() - now.valueOf()) / MILLISECONS_TO_HOURS;

        let openTime = new Date();
        openTime.setHours(this.getHours(op.openTime), this.getMinutes(op.openTime), 0, 0);
        op.openDateTime = openTime;
      }
    });
    return operationItems;
  }

  getHours(time : String) : number {
    return parseInt(time.split(':')[0]);
  }

  getMinutes(time: String) : number {
    return parseInt(time.split(':')[1]);
  }
}
