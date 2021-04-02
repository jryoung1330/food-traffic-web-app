import { Component, OnInit, Input } from '@angular/core';
import { Vendor } from 'src/entity/vendor';

@Component({
  selector: 'app-vendor-card',
  templateUrl: './vendor-card.component.html',
  styleUrls: ['./vendor-card.component.css']
})
export class VendorCardComponent implements OnInit {

  @Input('vendor') vendor: Vendor;
  expanded: boolean;
  isFavorited: boolean;

  constructor() { }

  ngOnInit() {
  }

  
  toggleExpansion() {
    this.expanded = !this.expanded;
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
  }


}
