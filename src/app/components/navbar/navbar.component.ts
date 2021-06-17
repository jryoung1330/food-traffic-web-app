import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/entity/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() username: string;
  hRouter: Router;

  constructor(private userService: UserService, private router: Router) {
    this.hRouter = router;
  }

  ngOnInit() {
    this.userService.user$.subscribe((payload: User) => {
      if (payload === null || payload.id === undefined) {
        let user = window.localStorage.getItem('user');
        if (user !== null) this.username = user.substring(user.indexOf(':') + 1);
      } else {
        this.username = payload.username;
      }
    });
  }

  logout() {
    let user = window.localStorage.getItem('user');
    this.userService.logoutUser(user.substring(0, user.indexOf(':')), this.router)
      .subscribe((payload) => {
        window.localStorage.removeItem('user');
        this.username = null;
        this.router.navigateByUrl('/login');
      }); // this.router.navigateByUrl('/login');
  }
}
