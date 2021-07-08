import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/entities/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string;
  hRouter: Router;
  isVendor: boolean;
  vendorId: string;

  constructor(private userService: UserService, private vendorService: VendorService, private router: Router) {
    this.hRouter = router;
    this.userService.user$.subscribe((payload: User) => {
      if (payload !== undefined && payload !== null) {
        if(payload.id === undefined) {
          this.setUpComponentByStorage();
        } else {
          this.setUpComponentByPayload(payload);
        }
      } else {
        this.username = null;
      }
    });
  }

  ngOnInit() { }

  setUpComponentByPayload(payload: User) {
    if(payload.employee !== undefined && payload.employee.admin) {
      this.isVendor = true;
      this.vendorId = payload.employee.vendorId.toString();
      this.getVendorName(payload.employee.vendorId.toString());
    } else {
      this.username = payload.username;
    }
  }

  setUpComponentByStorage() {
    this.vendorId = window.localStorage.getItem('vendor');
    let user = window.localStorage.getItem('user');
    this.isVendor = this.vendorId !== undefined;
    if (user !== null && !this.isVendor) {
      this.username = user.substring(user.indexOf(':') + 1);
    } else if (user !== null && this.isVendor) {
      this.getVendorName(window.localStorage.getItem('vendor'));
    }
  }

  getVendorName(vendorId: string) {
    this.vendorService.getVendor(vendorId)
      .subscribe((payload) => {
        if(payload !== undefined && payload !== null) {
          this.username = payload.displayName;
        }
      });
  }

  logout() {
    let user = window.localStorage.getItem('user');
    this.userService.logoutUser(user.substring(0, user.indexOf(':')), this.router)
      .subscribe(() => {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('vendor');
        this.username = null;
        this.router.navigateByUrl('/login');
      });
  }
}
