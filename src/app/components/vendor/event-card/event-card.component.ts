import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperationService } from 'src/app/services/operation.service';
import { OperationItem } from 'src/entities/operationItem';
import { EventDialog } from '../operations/event-dialog/event-dialog.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input('event') event: OperationItem;
  
  path: string;

  constructor(private opService: OperationService, private eventDialog: MatDialog) { }

  ngOnInit(): void {
    this.path = window.location.pathname;
  }

  // @template
  printDate(date: Date) : String {
    return date.toString().substring(5).replace('-', '/');
  }

  // @template
  compareDates(date1: Date, date2: Date): boolean {
    return date1.toLocaleDateString() === date2.toLocaleDateString();
  }

  // @click
  updateEvent() {
    const dialogRef = this.eventDialog.open(EventDialog, {
      width: '35%',
      height: '45%',
      data: this.event
    });

    dialogRef.afterClosed().subscribe(result => {
      if ("DELETE" === result) {
        this.opService.handleDelete(this.event, this.path).subscribe(
          (payload) => {
            this.opService.getEventsForMonthSub(this.path, new Date(this.event.eventStartDate));
          }
        );
      } else if (result) {
        this.opService.handleUpdate(this.event, this.event.vendorId, this.path)
          .subscribe((payload) => {
            this.event = payload;
            this.opService.getEventsForMonthSub(this.path, new Date(this.event.eventStartDate));
          });
      }
    });
  }
}
