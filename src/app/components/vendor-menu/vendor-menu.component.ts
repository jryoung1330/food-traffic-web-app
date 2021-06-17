import { Component, Input, OnInit } from '@angular/core';
import { Menu } from 'src/entity/menu';
import { MenuItem } from 'src/entity/menuItem';

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
    this.menuItems = this.menu.menuItems;
    this.menuItemTriplet = [];
    this.start = 0;
    this.end = 0;
    this.shiftRight();
  }

  shiftRight() {
    let isEmpty = this.menuItemTriplet.length === 0;
    let i = this.end === this.menuItems.length ? 0 : this.end;
    let j = 0;
    while(i<this.menuItems.length && j<3) {
      if(!isEmpty) this.menuItemTriplet.shift();
      this.menuItemTriplet.push(this.menuItems[i]);
      i++;
      j++;
    }
    this.end = i;
    this.start = i - 3;
  }

  shiftLeft() {
    let isEmpty = this.menuItemTriplet.length === 0;
    let i = this.start <= 0 ? this.menuItems.length-1 : this.start;
    let j = 0;
    while(i>=0 && j<3) {
      if(!isEmpty) this.menuItemTriplet.pop();
      this.menuItemTriplet.unshift(this.menuItems[i]);
      i--;
      j++;
    }
    this.start = i+1;
    this.end = i+1 + 3;
  }

}
