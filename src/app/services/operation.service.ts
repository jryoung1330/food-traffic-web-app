import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { OperationItem } from 'src/entities/operationItem';
import { Time } from 'src/entities/time';
import { EventDialog } from '../components/vendor/operations/event-dialog/event-dialog.component';

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'observe': 'response'
  }),
  withCredentials: true
};

const MILLISECONS_TO_HOURS : number = 36000000;

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private EventData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public events$ = this.EventData.asObservable();

  constructor(private httpClient: HttpClient) { }

  public getHoursOfOperation(id: number, searchKey: string): Observable<OperationItem[]> {
    return this.httpClient.get<OperationItem[]>('http://localhost:8888/vendors/' + id + "/operations?search=" + searchKey);
  }

  public getEventsForMonthSub(path:String, date: Date) {
    this.httpClient.get<Array<OperationItem>>('http://localhost:8888' + path + "/events?search=month&date=" + date.toISOString().split('T')[0])
      .subscribe((payload) => this.EventData.next(payload));
  }

  public getEventsForMonth(path:String, date: Date): Observable<Array<OperationItem>> {
    return this.httpClient.get<Array<OperationItem>>('http://localhost:8888' + path + "/events?search=month&date=" + date.toISOString().split('T')[0]);
  }

  public getEvents(path:String, date: Date): Observable<Array<OperationItem>> {
    return this.httpClient.get<Array<OperationItem>>('http://localhost:8888' + path + "/events?search=upcoming&date=" + date.toISOString().split('T')[0]);
  }

  public createEvent(path: string, operationItem: OperationItem): Observable<OperationItem> {
    return this.httpClient.post<OperationItem>('http://localhost:8888' + path + '/events/', JSON.stringify(operationItem), header);
  }

  public updateOperationItem(path: string, operationItem: OperationItem): Observable<OperationItem> {
    return this.httpClient.put<OperationItem>('http://localhost:8888' + path + "/operations/" + operationItem.id, 
      JSON.stringify(operationItem), header);
  }

  public deleteEvent(path: string, operationItem: OperationItem): Observable<OperationItem> {
    return this.httpClient.delete<OperationItem>('http://localhost:8888' + path + "/events/" + operationItem.id, header);
  }

  convertOperations(operationItems: OperationItem[]) {
    let now = new Date();
    operationItems.forEach(op => {
      this.convertOperation(now, op);
    });
    return operationItems;
  }

  convertOperation(now: Date, op: OperationItem) {
    if(!op.closed) {
      let closeTime = new Date();
      closeTime.setHours(this.getHours(op.closeTime), this.getMinutes(op.closeTime), 0, 0);
      op.closeDateTime = closeTime;
      op.timeLeft = (op.closeDateTime.valueOf() - now.valueOf()) / MILLISECONS_TO_HOURS;

      let openTime = new Date();
      openTime.setHours(this.getHours(op.openTime), this.getMinutes(op.openTime), 0, 0);
      op.openDateTime = openTime;
    }

    if(op.event) {
      op.startDate = new Date(op.eventStartDate.toString().replace(/-/g, '\/'));
      op.endDate = new Date(op.eventEndDate.toString().replace(/-/g, '\/'));
      op.endDate.setUTCHours(23, 59, 59);
    }
    return op;
  }
  
  getHours(time : String) : number {
    return parseInt(time.split(':')[0]);
  }

  getMinutes(time: String) : number {
    return parseInt(time.split(':')[1]);
  }

  handleDelete(opItem: OperationItem, path: string) {
    return this.deleteEvent(path, opItem);
  }

  handleCreate(opItem: OperationItem, vendorId: number, path: string) {
    if(opItem.closed) {
      opItem.openTime = null;
      opItem.closeTime = null;
    } else if(this.validateTime(opItem.open) && this.validateTime(opItem.close)) {
      opItem.openTime = opItem.open.toString();
      opItem.closeTime = opItem.close.toString();
    }
    opItem.vendorId = vendorId;
    return this.createEvent(path, opItem);
  }

  handleUpdate(opItem: OperationItem, vendorId: number, path: string) {
    if(opItem.closed) {
      opItem.openTime = null;
      opItem.closeTime = null;
    } else if(this.validateTime(opItem.open) && this.validateTime(opItem.close)) {
      opItem.openTime = opItem.open.toString();
      opItem.closeTime = opItem.close.toString();
    }
    opItem.vendorId = vendorId;
    return this.updateOperationItem(path, opItem);
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
    if (time === null) return '';
    const hours = this.convert12Hour(+time.substr(0, time.indexOf(":")));
    const minutes = this.pad(time.substr(time.indexOf(":") + 1), 2);
    return hours + ':' + minutes + ' ' + this.getTimeOfDay(+time.substr(0, time.indexOf(":")));
  }

  printEventTime(event: OperationItem) {
    return this.convertTime(event.openTime) + " - " + this.convertTime(event.closeTime);
  }

  addNDays(day: Date, n: number) : Date {
    day.setDate(day.getDate() + n);
    return day;
  }
}
