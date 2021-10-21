import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/services/operation.service';
import { VendorService } from 'src/app/services/vendor.service';
import { MenuItem } from 'src/entities/menuItem';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.css']
})
export class VendorHomeComponent implements OnInit {

  vendor: Vendor;
  hoursOfOperation: OperationItem[];
  menuItems: Array<MenuItem>;
  currentDate: OperationItem;

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
          this.hoursOfOperation = this.opService.convertOperations(payload);
          this.hoursOfOperation.forEach(op => {
            if(op.dayOfWeek === DAYS[new Date().getDay()]) {
              this.currentDate = op;
            }
          });
        } else {
          this.hoursOfOperation = null;
        }
        
      });
    } else {
      this.hoursOfOperation = null;
    }
  }

  getTopSellers(vendor: Vendor) {
    this.vendorService.getTopMenuItems(vendor.id).subscribe((payload) => {
      this.menuItems = payload;
    });
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
