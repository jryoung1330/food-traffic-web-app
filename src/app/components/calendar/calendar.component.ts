import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';
import { Vendor } from 'src/entities/vendor';
import { EventDialog } from '../vendor/operations/event-dialog/event-dialog.component';

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
  @Input('operationId') operationId: number;
  @Input('events') events: OperationItem[];

  constructor(private vendorService: VendorService, public eventDialog: MatDialog) { }

  ngOnInit(): void {
    this.month = this.generateMonth(this.currentDate);
  }

  prevMonth() {
    this.currentDate = this.addNDays(this.getStartOfMonth(this.currentDate), -1);
    this.month = this.generateMonth(this.currentDate);
  }

  nextMonth() {
    this.currentDate = this.addNDays(this.getEndOfMonth(this.currentDate), 1);
    this.month = this.generateMonth(this.currentDate);
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

   createEvent(date: Date): void {
    if(this.vendor) {
      let opItem = new OperationItem();
      opItem.eventStartDate = date;
      opItem.eventEndDate = date;

      const dialogRef = this.eventDialog.open(EventDialog, {
        width: '35%',
        height: '45%',
        data: opItem
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result) {
          if(result.closed) {
            result.openTime = null;
            result.closeTime = null;
          } else if(this.validateTime(result.open) && this.validateTime(result.close)) {
            result.openTime = result.open.toString();
            result.closeTime = result.close.toString();
          }
          result.operationId = this.operationId;
          result.vendorId = this.vendor.id;
          this.vendorService.createEvent(window.location.pathname, result).subscribe((payload) => {
            // do nothing
          });
        }
      });
    }
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
