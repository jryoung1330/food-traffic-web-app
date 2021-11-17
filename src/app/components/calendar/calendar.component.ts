import { Component, Input, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';

const MONTHS = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  @Input('vendor') vendor: Vendor;
  @Input('events') events: OperationItem[];

  currentDate: Date = new Date(); // used to track the month (not today's date)

  month: Date[][] = [];
  monthName: String;
  year: number;

  constructor(private opService: OperationService) { }

  ngOnInit(): void {
    this.month = this.generateMonth(this.currentDate);

    this.opService.events$.subscribe((payload) => {
      this.events = this.opService.convertOperations(payload);
      this.month = this.generateMonth(this.currentDate);
    });
  }

  // @click
  prevMonth() {
    this.currentDate = this.getStartOfMonth(this.addNDays(this.getStartOfMonth(this.currentDate), -1));
    this.opService.getEventsForMonthSub(window.location.pathname, this.currentDate);
  }

  // @click
  nextMonth() {
    this.currentDate = this.addNDays(this.getEndOfMonth(this.currentDate), 1);
    this.opService.getEventsForMonthSub(window.location.pathname, this.currentDate);
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

    this.monthName = MONTHS[startOfMonth.getMonth()];
    this.year = date.getFullYear();
 
    let day: Date = startOfMonth;
    let count: number = 1;
 
    // set up first week
    for(let i=0; i<7; i++) {
      if(((day.getDay() + 6) % 7) === i) {
       month[0][i] = new Date(day);
       day = this.addNDays(day, 1);
       count++;
      }
    }
 
    // set up other weeks
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
}
