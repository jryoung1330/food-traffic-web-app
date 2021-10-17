import { Component, OnInit } from '@angular/core';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/entities/vendor';

@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.css']
})
export class StatusPillComponent implements OnInit {

  isVendor: boolean;
  closed: boolean;
  vendor: Vendor;

  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    if(!localStorage.getItem('vendor')) {
      this.isVendor = false;
    } else {
      this.vendorService.getVendor(localStorage.getItem('vendor')).subscribe((payload) => {
        if(payload) {
          this.isVendor = true;
          this.vendor = payload;
        } else {
          this.isVendor = false;
        }
      })
    }

    this.closed = true;
  }

  toggleState() {
    this.closed = !this.closed;
  }

  switchState() {
    this.vendor.online = !this.vendor.online;
    this.vendorService.updateVendor(this.vendor).subscribe((payload) => {
      if(payload.online) {
        document.getElementById('opened-state').classList.add('online');
        document.getElementById('opened-state').classList.remove('offline');
      } else {
        document.getElementById('opened-state').classList.add('offline');
        document.getElementById('opened-state').classList.remove('online');
      }
      this.vendor = payload;
    });
  }

  updateLocation() {
    this.vendorService.fetchLocationForVendor(this.vendor);
  }

}
