import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { MenuItem } from 'src/entities/menuItem';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input('menu') menu: Menu;
  menuItems: MenuItem[];
  menuItemTriplet: MenuItem[];
  start: number;
  end: number;
  newMenuItem: MenuItem = new MenuItem();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.menuItems = this.menu.menuItems ? this.menu.menuItems : [];
    this.newMenuItem.menuId = this.menu.id;
    this.menuItemTriplet = [];
    this.start = 0;
    this.end = 0;
    this.initializeTriplet();
  }

  initializeTriplet() {
   for(let i=0; i<this.menuItems.length && i<3; i++) {
    this.menuItemTriplet.push(this.menuItems[i]);
    this.end++;
   }
  }

  shiftRight() {
    if(this.end !== this.menuItems.length) {
      this.menuItemTriplet.shift();
      this.menuItemTriplet.push(this.menuItems[this.end]);
      this.end++;
      this.start++;
    }
  }

  shiftLeft() {
    if(this.start > 0) {
      this.menuItemTriplet.pop();
      this.menuItemTriplet.unshift(this.menuItems[this.start-1]);
      this.end--;
      this.start--;
    }
  }
  
}
