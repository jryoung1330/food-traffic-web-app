import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  @Input('mode') mode: string;

  constructor(public dialog: MatDialog, private vendorService: VendorService) { }

  ngOnInit(): void {}

  /* VENDOR mode functions */

  openDialog(): void {
    const dialogRef = this.dialog.open(MenuItemDialog, {
      width: '35%',
      height: '70%',
      data: this.item
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        if(result === DELETE) {
          this.deleteMenuItem(this.item);
        } else {
          this.updateMenuItem(result);
        }
      }
    });
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
