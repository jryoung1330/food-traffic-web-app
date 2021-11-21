import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { slideInLeftOnEnterAnimation, slideOutLeftOnLeaveAnimation } from 'angular-animations';
import { OperationService } from 'src/app/services/operation.service';
import { VendorService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { ResponseMetaData } from 'src/entities/metadata';
import { OperationItem } from 'src/entities/operationItem';
import { Payload } from 'src/entities/payload';
import { Vendor } from 'src/entities/vendor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slideInLeftOnEnterAnimation({delay: 0, duration: 500}),
              slideOutLeftOnLeaveAnimation({delay: 0, duration: 500})],
})
export class HomeComponent implements OnInit {

  city: string;
  state: string;
  vendors: Array<Vendor> = [];
  expanded: number;
  searchKey: string;
  showVendor: boolean;
  vendorToShow: Vendor;
  showFavorites: boolean;
  operationItems: OperationItem[];
  menus: Array<Menu>;
  pageInfo: ResponseMetaData;

  constructor(private http: HttpClient,
              private vendorService: VendorService,
              private operationService: OperationService) { 
    this.vendorService.vendor$.subscribe((payload) => {
      if(this.vendors.length === 0) {
        this.vendors = payload;
      } else {
        this.vendors = this.vendors.concat(payload);
      }
    });

    this.vendorService.meta$.subscribe((payload) => {
      this.pageInfo = payload;
    });

    this.vendorService.location$.subscribe((currentLocation) => {
      this.city = currentLocation.city;
      this.state = currentLocation.region;
    });
  }

  ngOnInit() {
    this.vendorService.fetchLocation();
    this.showFavorites = false;
  }

  searchVendors(value : string) {
    this.http.get('http://localhost:8888/vendors?name=' + value)
      .subscribe((payload: Payload) => {
        this.vendors = payload.data;
      });
  }

  toggleFavorites() {
    this.showFavorites = !this.showFavorites;
    if (this.showFavorites) {
      this.vendors = [];
      this.vendorService.getFavoriteVendors();
    } else {
      this.vendors = [];
      this.vendorService.fetchLocation();
    }
  }

  toggleShowVendor(vendor: Vendor) {
    if(this.vendorToShow == null || this.vendorToShow.id === vendor.id) {
      this.showVendor = !this.showVendor;
    }

    if(this.showVendor) {
      this.vendorToShow = vendor;
      this.vendorService.getMenus(vendor.id).subscribe((payload) => {
        this.menus = payload;
      });
      this.operationService.getHoursOfOperation(vendor.id, "week").subscribe((payload) => {
        this.operationItems = payload;
      });
    } else {
      this.vendorToShow = null;
    }
  }

  // @template
  spaceOut(name: String) : String {
    let newName = "";
    for(let i=0; i<name.length; i++) {
      newName += name.charAt(i) + " ";
    }
    return newName.trim();
  }

}
