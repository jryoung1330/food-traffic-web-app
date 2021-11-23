import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/entities/user';
import { Vendor } from 'src/entities/vendor';

@Component({
  selector: 'app-vendor-card',
  templateUrl: './vendor-card.component.html',
  styleUrls: ['./vendor-card.component.css']
})
export class VendorCardComponent implements OnInit {

  @Input('vendor') vendor: Vendor;
  expanded: boolean;
  isFavorited: boolean;
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((payload) => {
      if(payload && payload.id) {
        this.user = payload;
        this.getFavorite(payload.id);
      }
    });
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
    this.userService.setFavorite(this.user.id, this.vendor.id);
  }

  getFavorite(userId: number) {
    this.userService.getFavorite(userId, this.vendor.id)
      .subscribe((data: boolean) => {
        this.isFavorited = data;
      });
  }
}
