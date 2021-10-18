import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { VendorService } from 'src/app/services/vendor.service';
import { MenuItem } from 'src/entities/menuItem';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.css']
})
export class VendorHomeComponent implements OnInit {

  vendor: Vendor;
  operationItems: OperationItem[];
  menuItems: Array<MenuItem>;

  constructor(private vendorService: VendorService, private opService: OperationService) { }

  ngOnInit(): void {
    this.vendorService.getVendor(window.localStorage.getItem('vendor'))
      .subscribe((payload) => {
        this.vendor = payload;
        this.getHoursOfOperation(this.vendor);
        this.getTopSellers(this.vendor);
      });
  }

  getHoursOfOperation(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.opService.getHoursOfOperation(vendor.id, "3-day").subscribe((payload: OperationItem[]) => {
        if(payload !== null) {
          this.operationItems = this.opService.convertOperations(payload);
        } else {
          this.operationItems = null;
        }
        
      });
    } else {
      this.operationItems = null;
    }
  }

  getTopSellers(vendor: Vendor) {
    this.vendorService.getTopMenuItems(vendor.id).subscribe((payload) => {
      this.menuItems = payload;
    });
  }
}
