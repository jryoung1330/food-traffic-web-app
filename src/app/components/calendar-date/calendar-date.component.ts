import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationItem } from 'src/entities/operationItem';

@Component({
  selector: 'app-calendar-date',
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.css']
})
export class CalendarDateComponent implements OnInit {

  @Input("day") day: Date;
  @Input("events") allEvents: OperationItem[];
  todaysDate = new Date();
  hasEvent: boolean;
  events: OperationItem[];


  constructor() { }

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

}
