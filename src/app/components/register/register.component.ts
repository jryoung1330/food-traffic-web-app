import { Component, OnInit, Input } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { FoodTruck } from 'src/entity/foodtruck';
import { Location } from 'src/entity/location';
import { HttpService } from 'src/app/services/foodtruck.service';
import { User } from 'src/entity/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  steps:Array<boolean> = new Array<boolean>(10);
  @Input('user') user: User = new User;
  @Input('password2') password2: string = '';
  isEmployee: boolean;
  location: Location;
  foodtrucks: Array<FoodTruck>;
  file: File;
  newUser: User;
  @Input('foodtruckToAdd') foodtruckToAdd: FoodTruck = new FoodTruck;

  constructor(private httpService: HttpService, private userService: UserService, private routingService:RoutingService) { }

  ngOnInit() {
    this.routingService.setActiveIcon();
    this.steps[0] = true;
    this.httpService.location$.subscribe((data) => this.location = data);
    this.httpService.foodtruck$.subscribe((data) => this.foodtrucks = data);
    this.userService.user$.subscribe((data) => this.newUser = data);
    this.httpService.fetchLocation();
  }

  moveForward() {
    for(var i=0; i<this.steps.length; i++) {
      if(this.steps[i] == true && i+1 < this.steps.length) {
        this.steps[i] = false;
        this.steps[i+1] = true;
        break;
      } 
    }
  }

  moveBack() {
    for(var i=0; i<this.steps.length; i++) {
      if(this.steps[i] == true && i-1 >= 0) {
        this.steps[i] = false;
        this.steps[i-1] = true;
        break;
      } 
    }
  }

  onSubmit() {
    this.user.passwordHash = btoa(this.user.passwordHash);
    this.userService.postNewUser(this.user);
    this.moveForward();
    this.initializeFoodTruck();
  }

  onSubmitFoodTruck() {
    console.log(this.foodtruckToAdd);
    this.moveForward();
  }

  initializeFoodTruck() {
    if(this.location != null){
      this.foodtruckToAdd.city = this.location.city;
      this.foodtruckToAdd.state = this.location.region;
      this.foodtruckToAdd.zipCode = this.location.zip;
      this.foodtruckToAdd.lat = this.location.lat;
      this.foodtruckToAdd.lon = this.location.lon;
      console.log(this.foodtruckToAdd);
    }
  }

  setEmployeeFlag(bool:boolean) {
    this.isEmployee = bool;
  }
}
