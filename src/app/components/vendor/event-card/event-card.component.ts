import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';
import { EventDialog } from '../operations/event-dialog/event-dialog.component';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input('event') event: OperationItem;
  @Input('isVendor') isVendor: boolean;

  constructor(private vendorService: VendorService, private eventDialog: MatDialog) { }

  ngOnInit(): void {
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
    if(time === null) return '';
    const hours = this.convert12Hour(+time.substr(0, time.indexOf(":")));
    const minutes = this.pad(time.substr(time.indexOf(":") + 1), 2);
    return hours + ':' + minutes + ' ' + this.getTimeOfDay(+time.substr(0, time.indexOf(":")));
  }

  printDate(date: Date) : String {
    return date.toString().substring(5).replace('-', '/');
  }

  editEvent(): void {
    if(this.isVendor) {
      const dialogRef = this.eventDialog.open(EventDialog, {
        width: '35%',
        height: '45%',
        data: this.event
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if("DELETE" === result) {
          this.vendorService.deleteEvent(window.location.pathname, this.event).subscribe((payload) => {
            this.vendorService.getEventsForMonthSub(window.location.pathname, new Date());
          });
        } else if(result) {
          if(result.closed) {
            result.openTime = null;
            result.closeTime = null;
          } else if(this.validateTime(result.open) && this.validateTime(result.close)) {
            result.openTime = result.open.toString();
            result.closeTime = result.close.toString();
          }
          this.vendorService.updateOperationItem(window.location.pathname, result).subscribe((payload) => {
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
