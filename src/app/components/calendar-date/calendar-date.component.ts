import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { VendorService } from 'src/app/services/vendor.service';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';
import { EventDialog } from '../vendor/operations/event-dialog/event-dialog.component';

@Component({
  selector: 'app-calendar-date',
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.css']
})
export class CalendarDateComponent implements OnInit {

  @Input("day") day: Date;
  @Input("events") allEvents: OperationItem[];
  @Input("vendorId") vendorId: number;

  todaysDate = new Date();
  hasEvent: boolean;
  events: OperationItem[];

  constructor(private vendorService: VendorService, public eventDialog: MatDialog) { }

  ngOnInit(): void {
    this.containsEvent().subscribe((payload) => {
      this.events = payload;
    });
  }

  containsEvent(): Observable<OperationItem[]> {
    let sumEvents: OperationItem[] = [];
    this.allEvents.forEach(event => {
      let temp = this.addNDays(new Date(event.eventStartDate), 1);
      if(temp.toDateString() == this.day?.toDateString()) {
        sumEvents.push(event);
      }
    });
    
    return new Observable((observer) => {
      observer.next(sumEvents);
    });
  }

  addNDays(day: Date, n: number) : Date {
    day.setDate(day.getDate() + n);
    return day;
  }

  createOrEditEvent(): void {
    let opItem = new OperationItem();
    let update = false;

    // FIXME: Expand for multiple events on the same day
    if(this.events.length > 0) {
      opItem = this.events[0];
      update = true;
    }

    if(this.vendorId) {
      if(!update) {
        opItem.eventStartDate = this.day;
        opItem.eventEndDate = this.day;
      }

      const dialogRef = this.eventDialog.open(EventDialog, {
        width: '35%',
        height: '45%',
        data: opItem
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if("DELETE" === result) {
          this.vendorService.deleteEvent(window.location.pathname, opItem).subscribe((payload) => {
            this.vendorService.getEventsForMonthSub(window.location.pathname, new Date(opItem.eventStartDate));
          });
        } else if(result) {
          if(result.closed) {
            result.openTime = null;
            result.closeTime = null;
          } else if(this.validateTime(result.open) && this.validateTime(result.close)) {
            result.openTime = result.open.toString();
            result.closeTime = result.close.toString();
          }
          result.vendorId = this.vendorId;
          if(!update) {
            this.vendorService.createEvent(window.location.pathname, result).subscribe((payload) => {
              this.events.push(payload);
              this.vendorService.getEventsForMonthSub(window.location.pathname, new Date(payload.eventStartDate));
            });
          } else {
            this.vendorService.updateOperationItem(window.location.pathname, result).subscribe((payload) => {
              this.vendorService.getEventsForMonthSub(window.location.pathname, new Date(payload.eventStartDate));
            });
          }
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
