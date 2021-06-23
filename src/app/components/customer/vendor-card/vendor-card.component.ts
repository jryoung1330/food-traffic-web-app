import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
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
  userId: string;

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    let user = window.localStorage.getItem('user');
    this.userId = user.substring(0, user.indexOf(':'));
    this.getFavorite();
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
    this.http.put('http://localhost:8889/users/' + this.userId + '/favorites/' + this.vendor.id, '')
      .subscribe();
  }

  getFavorite() {
    this.http.get('http://localhost:8889/users/' + this.userId + '/favorites/' + this.vendor.id)
      .subscribe((data: boolean) => {
        this.isFavorited = data;
      });
  }


}
