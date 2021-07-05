import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vendor } from 'src/entities/vendor';
import { RoutingService } from 'src/app/services/routing.service';
import { VendorService } from 'src/app/services/vendor.service';
import { slideInLeftOnEnterAnimation, slideOutLeftOnLeaveAnimation } from 'angular-animations';
import { Operation } from 'src/entities/operation';
import { OperationItem } from 'src/entities/operationItem';
import { Menu } from 'src/entities/menu';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slideInLeftOnEnterAnimation({delay: 0, duration: 500}),
              slideOutLeftOnLeaveAnimation({delay: 0, duration: 500})]
})
export class HomeComponent implements OnInit {

  city: string;
  state: string;
  vendors: Array<Vendor>;
  expanded: number;
  searchKey: string;
  showVendor: boolean;
  vendor: Vendor;
  showFavorites: boolean;
  operationItems: OperationItem[];
  menus: Array<Menu>;

  constructor(private http: HttpClient, private vendorService: VendorService, private routingService: RoutingService) { }

  ngOnInit() {
    this.getLocation();
    this.showFavorites = false;
  }

  getLocation() {
    this.http.get('http://ip-api.com/json')
    .subscribe((data) => {
      this.city = data['city'],
      this.state = data['region'];
      this.getVendorsInArea();
    });
  }

  getVendorsInArea() {
    if (this.city != null && this.state != null) {
      this.http.get('http://localhost:8888/vendors?city=' + this.city + '&state=' + this.state)
      .subscribe((data: Array<Vendor>) => {
        this.vendors = data;
      });
    }
  }

  searchVendors(value : string) {
    this.http.get('http://localhost:8888/vendors?name=' + value)
      .subscribe((data: Array<Vendor>) => {
        this.vendors = data;
      });
  }

  toggleShowVendor(vendor: Vendor) {
    if(this.vendor === undefined || vendor.id == this.vendor.id) this.showVendor = !this.showVendor;
    this.vendor = vendor;
    this.getHoursOfOperation(this.vendor);
    this.getMenus(this.vendor);
  }

  toggleFavorites() {
    this.showFavorites = !this.showFavorites;
    if (this.showFavorites) {
      this.http.get('http://localhost:8888/vendors/favorites', header)
        .subscribe((data: Array<Vendor>) => {
          this.vendors = data;
        });
    } else {
      this.getVendorsInArea()
    }
  }

  getHoursOfOperation(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.vendorService.getHoursOfOperation(vendor.id, "3-day").subscribe((payload: Operation) => {
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
      this.vendorService.getMenus(vendor.id).subscribe((payload: Array<Menu>) => {
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
