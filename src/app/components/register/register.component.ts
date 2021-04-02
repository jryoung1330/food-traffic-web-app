import { Component, OnInit, Input } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { Vendor } from 'src/entity/vendor';
import { Location } from 'src/entity/location';
import { HttpService } from 'src/app/services/vendor.service';
import { User } from 'src/entity/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input('user') user: User = new User;
  @Input('password2') password2: string = '';
  @Input('vendorToAdd') vendorToAdd: Vendor = new Vendor;

  steps: Array<boolean> = new Array<boolean>(10);
  isEmployee: boolean;
  location: Location;
  vendors: Array<Vendor>;
  file: File;
  newUser: User;

  constructor(private httpService: HttpService, private userService: UserService, private routingService: RoutingService) { }

  ngOnInit() {
    this.routingService.setActiveIcon();
    this.steps[0] = true;
    this.httpService.location$.subscribe((data) => this.location = data);
    this.httpService.vendor$.subscribe((data) => this.vendors = data);
    this.userService.user$.subscribe((data) => this.newUser = data);
    this.httpService.fetchLocation();
  }

  moveForward() {
    for (let i = 0; i < this.steps.length; i++) {
      if (this.steps[i] === true && i + 1 < this.steps.length) {
        this.steps[i] = false;
        this.steps[i + 1] = true;
        break;
      }
    }
  }

  moveBack() {
    for (let i = 0; i < this.steps.length; i++) {
      if (this.steps[i] === true && i - 1 >= 0) {
        this.steps[i] = false;
        this.steps[i - 1] = true;
        break;
      }
    }
  }

  onSubmit() {
    this.user.passwordHash = btoa(this.user.passwordHash);
    //this.userService.postNewUser(this.user);
    this.moveForward();
    this.initializeVendor();
  }

  onSubmitVendor() {
    console.log(this.vendorToAdd);
    this.moveForward();
  }

  initializeVendor() {
    if (this.location != null) {
      this.vendorToAdd.city = this.location.city;
      this.vendorToAdd.state = this.location.region;
      this.vendorToAdd.zipCode = this.location.zip;
      this.vendorToAdd.lat = this.location.lat;
      this.vendorToAdd.lon = this.location.lon;
      console.log(this.vendorToAdd);
    }
  }

  setEmployeeFlag(bool: boolean) {
    this.isEmployee = bool;
  }
}
