import { Component, OnInit, Input } from '@angular/core';
import { RoutingService } from 'src/app/services/routing.service';
import { Vendor } from 'src/entity/vendor';
import { Location } from 'src/entity/location';
import { HttpService } from 'src/app/services/vendor.service';
import { User } from 'src/entity/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Tag } from 'src/entity/tag';

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
  tags: Array<Tag>;

  constructor(private httpService: HttpService, private userService: UserService, private routingService: RoutingService, private router: Router) { }

  ngOnInit() {
    this.routingService.setActiveIcon();
    this.steps[0] = true;
    this.httpService.location$.subscribe((data) => this.location = data);
    this.httpService.vendor$.subscribe((data) => this.vendors = data);
    // this.userService.user$.subscribe((data) => this.newUser = data);
    this.httpService.fetchLocation();
    this.httpService.getAllTags().subscribe((tags) => this.tags = tags);
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
    this.userService.postNewUser(this.user, btoa(this.user.username + ':' + this.user.passwordHash))
      .subscribe(user => {
        this.user = user;
        if(this.user.id > 0 && this.isEmployee) {
          this.moveForward();
          this.initializeVendor();
        } else if (this.user.id > 0 && !this.isEmployee) {
          this.router.navigateByUrl('/home');
        }
      });
  }

  continue() {
    this.moveForward();
  }

  onSubmitVendor() {
    this.httpService.createVendor(this.vendorToAdd)
      .subscribe((vendor) => {
        this.vendorToAdd = vendor;
        if (this.vendorToAdd.id > 0) {
          this.router.navigateByUrl('/home');
        }
        (error) => {
          console.log(error);
        }
      });
  }

  initializeVendor() {
    if (this.location != null) {
      this.vendorToAdd.city = this.location.city;
      this.vendorToAdd.state = this.location.region;
      this.vendorToAdd.zipCode = this.location.zip;
      this.vendorToAdd.latitude = this.location.lat;
      this.vendorToAdd.longitude = this.location.lon;
    }
  }

  setEmployeeFlag(bool: boolean) {
    this.isEmployee = bool;
  }

  toggleTag(tag: Tag) {
    let newTags : Array<Tag> = this.vendorToAdd.tags ? this.vendorToAdd.tags : new Array<Tag>();
    let index = newTags.indexOf(tag);
    if(index === -1 && newTags.length < 3) {
      newTags.push(tag);
    } else if (index >= 0) {
      newTags.splice(index, 1);
    }
    this.vendorToAdd.tags = newTags;
  }
}
