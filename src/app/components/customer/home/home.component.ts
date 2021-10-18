import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { slideInLeftOnEnterAnimation, slideOutLeftOnLeaveAnimation } from 'angular-animations';
import { Menu } from 'src/entities/menu';
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

  constructor(private http: HttpClient) { }

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

}
