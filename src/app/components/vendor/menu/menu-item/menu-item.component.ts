import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { MenuItem } from 'src/entities/menuItem';
import { MenuItemDialog } from './menu-item-dialog/menu-item-dialog.component';

const DELETE = 'DELETE';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @Input('item') item: MenuItem;

  constructor(public dialog: MatDialog, private vendorService: VendorService) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MenuItemDialog, {
      width: '35%',
      height: '70%',
      data: this.item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result !== undefined) {
        if(result === DELETE) {
          this.deleteMenuItem(this.item);
        } else if(result.id === undefined) {
          this.createMenuItem(result);
        } else {
          this.updateMenuItem(result);
        }
      }
    });
  }

  createMenuItem(menuItem: MenuItem): MenuItem  {
    menuItem.price = Number.parseFloat(menuItem.price.toFixed(2));
    menuItem.calories = Number.parseFloat(menuItem.calories.toFixed());
    menuItem.vegan = menuItem.vegan !== undefined;
    menuItem.vegetarian = menuItem.vegetarian !== undefined;
    menuItem.glutenFree = menuItem.glutenFree !== undefined;
    menuItem.dairyFree = menuItem.dairyFree !== undefined;
    menuItem.containsNuts = menuItem.containsNuts !== undefined;
    this.vendorService.createMenuItem(window.location.pathname, menuItem).subscribe((payload) => {
      if(payload !== undefined) {
        this.vendorService.getMenusForSub(Number.parseInt(localStorage.getItem('vendor')));
      }
    });
    return menuItem;
  }

  updateMenuItem(menuItem: MenuItem): void {
    this.vendorService.updateMenuItem(window.location.pathname, menuItem).subscribe();
  }

  deleteMenuItem(menuItem: MenuItem): void {
    this.vendorService.deleteMenuItem(window.location.pathname, menuItem).subscribe((payload) => {
      if(payload !== undefined) {
        this.vendorService.getMenusForSub(Number.parseInt(localStorage.getItem('vendor')));
      }
    });
  }
}
