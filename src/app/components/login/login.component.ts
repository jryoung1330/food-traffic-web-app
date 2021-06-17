import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/entity/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Input('user') user: User = new User;
  loggedInUser: User;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if(window.localStorage.getItem('user') !== null && window.localStorage.getItem('user') !== 'undefined') {
      this.router.navigateByUrl('/home');
    }
  }

  loginUser() {
    let credentials = btoa(this.user.username + ':' + this.user.passwordHash);
    this.userService.loginUser(this.user, credentials).subscribe((payload : User) => {
      if(payload != undefined && payload != null) {
        this.loggedInUser = payload;
        window.localStorage.setItem('user', payload.id + ':' + payload.username);
        if(this.loggedInUser.id > 0) this.router.navigateByUrl('/home');
      }
    });
  }



}
