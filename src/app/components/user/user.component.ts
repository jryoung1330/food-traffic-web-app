import { Component, Input, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/entity/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() user: User;
  emailFlag: boolean;
  passwordFlag: boolean;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUser();
    this.emailFlag = true;
    this.passwordFlag = true;
  }

  getUser() {
    this.userService.getUserByToken().subscribe(
      (payload) => {
        this.user = payload;
      }
    );
  }

}
