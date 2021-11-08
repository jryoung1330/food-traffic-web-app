import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/services/user.service';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/entities/vendor';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  displayName: string;
  isVendor: boolean;
  vendorId: number;

	constructor(private userService: UserService, 
				private vendorService: VendorService,
				public router: Router,
				public auth: AuthService,
				@Inject(DOCUMENT) private doc: Document) {

		this.auth.isAuthenticated$.subscribe((authenticated) => {
			if (authenticated) {
				this.userService.getUserForSub();
				this.userService.user$.subscribe((payload) => {
					if (payload.employee) {
						this.isVendor = true;
						this.vendorId = payload.employee.vendorId;
						this.getVendorName(payload.employee.vendorId);
						this.vendorService.vendor$.subscribe((vendor: Vendor) => {
							this.displayName = vendor.displayName;
						});
					} else {
						this.displayName = payload.firstName + ' ' + payload.lastName;
					}
				});
			}
		});
	}

  ngOnInit() { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
	if (document.body.scrollTop > 20 ||     
	document.documentElement.scrollTop > 20) {
	  document.getElementById('main-navbar').classList.add('shadow');
	} else {
	  document.getElementById('main-navbar').classList.remove('shadow');
	}
  }

  getVendorName(vendorId: number) {
	this.vendorService.getVendorSub(vendorId);
  }

  logout() {
	this.auth.logout({ returnTo: this.doc.location.origin });
  }
}
