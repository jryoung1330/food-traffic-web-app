import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OperationService } from 'src/app/services/operation.service';
import { OperationItem } from 'src/entities/operationItem';
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
  events: OperationItem[];
  path: string;

  constructor(private eventDialog: MatDialog, private opService: OperationService) { }

  ngOnInit(): void {
    this.path = window.location.pathname;

    // async get event if in array
    this.getEvents().subscribe((payload) => {
      this.events = payload;
    });
  }

  /**
   * Searches events property for events on this day
   * @returns observable of events
   */
  getEvents(): Observable<OperationItem[]> {
    let sumEvents: OperationItem[] = [];
    this.allEvents.forEach(event => {
      if(event.startDate <= this.day && event.endDate >= this.day) {
        sumEvents.push(event);
      }
    });
    
    return new Observable((observer) => {
      observer.next(sumEvents);
    });
  }

  /**
   * Pop-up dialog to create or edit an event for this day
   */
  createOrUpdateEvent() {
    let opItem: OperationItem;
    let edit = (this.events.length > 0);

    if(!edit) {
      // set up new event
      opItem = new OperationItem();
      opItem.eventStartDate = this.day;
      opItem.eventEndDate = this.day;
    } else {
      opItem = this.events[0];
    }

    const dialogRef = this.eventDialog.open(EventDialog, {
      width: '35%',
      height: '45%',
      data: {
        events: this.events,
        editMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if("DELETE" === result) {
        this.opService.handleDelete(opItem, this.path).subscribe(
          (payload) => {
            // remove event from day and refresh list
            this.opService.getEventsForMonthSub(this.path, this.day);
        });
      } else if(result) {
        if(edit) {
          this.opService.handleUpdate(opItem, opItem.vendorId, this.path).subscribe((payload) => {
            // refresh list
            this.opService.getEventsForMonthSub(this.path, this.day);
          });
        } else {
          this.opService.handleCreate(opItem, this.vendorId, this.path)
            .subscribe((payload) => {
              // add event to day and refresh list
              this.opService.getEventsForMonthSub(this.path, this.day);
          });
        }
      }
    });
  }

}
