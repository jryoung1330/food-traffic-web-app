import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { HttpService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { Operation } from 'src/entities/operation';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';

const header = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'observe': 'response',
    "Authorization": ""
  }),
  withCredentials: true
};

const MILLISECONS_TO_HOURS : number = 36000000;
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.css']
})
export class VendorHomeComponent implements OnInit {

  vendor: Vendor;
  operationItems: OperationItem[];
  menus: Array<Menu>;

  constructor(private http: HttpClient, private httpService: HttpService, private routingService: RoutingService) { }

  ngOnInit(): void {
    this.httpService.getVendor(window.localStorage.getItem('vendor'))
      .subscribe((payload) => {
        this.vendor = payload;
        this.getHoursOfOperation(this.vendor);
        this.getMenus(this.vendor);
      });
  }

  getHoursOfOperation(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.httpService.getHoursOfOperation(vendor.id).subscribe((payload: Operation) => {
        if(payload !== null) {
          this.operationItems = this.convertOperations(payload.operationItems);
        } else {
          this.operationItems = null;
        }
        
      });
    } else {
      this.operationItems = null;
    }
  }

  convertOperations(operationItems: OperationItem[]) {
    let now = new Date();
    operationItems.forEach(op => {
      if(op.dayOfWeek === DAYS[now.getDay()]) {
        op.dayOfWeek = 'TODAY';
      } else if(op.dayOfWeek === DAYS[now.getDay()+1]) {
        op.dayOfWeek = 'TOMORROW';
      }

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

  getMenus(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.httpService.getMenus(vendor.id).subscribe((payload: Array<Menu>) => {
        if(payload !== null) {
          this.menus = payload;
        } else {
          this.menus = null;
        }
      });
    } else {
      this.menus = null;
    }
  }
}
