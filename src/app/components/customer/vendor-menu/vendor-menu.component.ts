import { Component, Input, OnInit } from '@angular/core';
import { Menu } from 'src/entities/menu';
import { MenuItem } from 'src/entities/menuItem';

@Component({
  selector: 'app-vendor-menu',
  templateUrl: './vendor-menu.component.html',
  styleUrls: ['./vendor-menu.component.css']
})
export class VendorMenuComponent implements OnInit {

  @Input('menu') menu: Menu;
  menuItems: MenuItem[];
  menuItemTriplet: MenuItem[];
  start: number;
  end: number;

  constructor() { }

  ngOnInit(): void {
    this.menuItems = this.menu.menuItems ? this.menu.menuItems : [];
    this.menuItemTriplet = [];
    this.start = 0;
    this.end = 0;
    this.initializeTriplet();
  }

  initializeTriplet() {
    for (let i = 0; i < this.menuItems.length && i < 3; i++) {
      this.menuItemTriplet.push(this.menuItems[i]);
      this.end++;
    }
  }

  shiftRight() {
    if (this.end !== this.menuItems.length) {
      this.menuItemTriplet.shift();
      this.menuItemTriplet.push(this.menuItems[this.end]);
      this.end++;
      this.start++;
    }
  }

  shiftLeft() {
    if (this.start > 0) {
      this.menuItemTriplet.pop();
      this.menuItemTriplet.unshift(this.menuItems[this.start - 1]);
      this.end--;
      this.start--;
    }
  }

}
