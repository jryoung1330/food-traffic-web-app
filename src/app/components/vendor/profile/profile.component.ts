import { Component, OnInit } from '@angular/core';
import { VendorService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { Operation } from 'src/entities/operation';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';

const MILLISECONS_TO_HOURS : number = 36000000;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class VendorProfileComponent implements OnInit {

  vendor: Vendor;
  operationItems: OperationItem[];
  menus: Menu[];
  createNewMenu: boolean = false;
  newMenu: Menu = new Menu();
  addMenu: boolean = false;

  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    this.vendorService.menu$.subscribe((payload) => {
      this.menus = payload;
    });

    this.vendorService.getVendor(window.localStorage.getItem('vendor')).subscribe((payload) => {
      this.vendor = payload;
      this.getHoursOfOperation(payload);
      this.getMenus(payload);
    });
  }

  getHoursOfOperation(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.vendorService.getHoursOfOperation(vendor.id, "week").subscribe((payload: Operation) => {
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
      this.vendorService.getMenusForSub(vendor.id);
    } else {
      this.menus = [];
    }
  }

  createMenu() {
    if(this.newMenu.description != null && this.newMenu.description.length !== 0) {
      this.newMenu.vendorId = this.vendor.id;
      this.vendorService.createMenu(window.location.pathname, this.newMenu).subscribe((payload) => {
        this.menus.push(payload);
        this.createNewMenu = false;
        this.newMenu = new Menu();
      });
    } else {
      // TODO: handle error
    }
  }

}
