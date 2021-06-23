import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/entities/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() username: string;
  hRouter: Router;
  isVendor: boolean;

  constructor(private userService: UserService, private httpService: HttpService, private router: Router) {
    this.hRouter = router;
  }

  ngOnInit() {
    this.userService.user$.subscribe((payload: User) => {
      if (payload === null || payload.id === undefined) {
        let user = window.localStorage.getItem('user');
        this.isVendor = window.localStorage.getItem('vendor') !== undefined ? true : false;
        if (user !== null && !this.isVendor) {
          this.username = user.substring(user.indexOf(':') + 1);
        } else if (user !== null && this.isVendor) {
          this.getVendorName();
        }
      } else {
        this.username = null;
      }
    });
  }

  getVendorName() {
    this.httpService.getVendor(window.localStorage.getItem('vendor'))
      .subscribe((payload) => {
        if(payload !== undefined && payload !== null) {
          this.username = payload.displayName;
        }
      });
  }

  logout() {
    let user = window.localStorage.getItem('user');
    this.userService.logoutUser(user.substring(0, user.indexOf(':')), this.router)
      .subscribe((payload) => {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('vendor');
        this.username = null;
        this.router.navigateByUrl('/login');
      });
  }
}
