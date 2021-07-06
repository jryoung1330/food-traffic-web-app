import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/entities/user';

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
        let vendorId = null;
        if(payload.employee !== undefined && payload.employee !== null && payload.employee.admin) {
          vendorId = payload.employee.vendorId.toString();
          window.localStorage.setItem('vendor', vendorId);
        }
        let url = vendorId !== null ? '/vendors/' + vendorId + '/home' : '/home';
        this.router.navigateByUrl(url);
      }
    });
  }



}
