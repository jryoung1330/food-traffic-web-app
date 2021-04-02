import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from 'src/entity/vendor';
import { RoutingService } from 'src/app/services/routing.service';
import { HttpService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  city: string;
  state: string;
  vendors: Array<Vendor>;
  expanded: number;

  constructor(private http: HttpClient, private httpService: HttpService, private routingService: RoutingService) { }

  ngOnInit() {
    this.getLocation();
    this.routingService.setActiveIcon();
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
        console.log(this.vendors);
      });
    }
  }
}
