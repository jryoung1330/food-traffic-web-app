import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { MenuItem } from 'src/entities/menuItem';
import { ConfirmationDialog } from '../../confirmation/confirmation.component';

const DELETE = 'DELETE';

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

  constructor(public dialog: MatDialog, public vendorService: VendorService) { }

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

  openDialog(): void {
    const dialogRef = this.dialog.open(MenuDialog, {
      width: '30rem',
      data: this.menu
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'DELETE') {
        this.vendorService.deleteMenu(window.location.pathname, this.menu)
          .subscribe((payload) => {
            this.vendorService.getMenusForSub(this.menu.vendorId);
          });
      } else if (result && typeof result === 'object') {
        this.vendorService.updateMenu(window.location.pathname, this.menu)
          .subscribe((payload) => this.menu = payload);
      }
    });
  }
}

@Component({
  selector: 'menu-dialog',
  templateUrl: 'menu-dialog.html',
  styleUrls: ['./menu.component.css']
})
export class MenuDialog {
  constructor(
    public dialogRef: MatDialogRef<MenuDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Menu) {}
    @Input('hasError') hasError: boolean = false;

    onNoClick(): void {
      this.dialogRef.close(undefined);
    }

    save(data: Menu): void {
      if(!data.name || data.name.length == 0) {
        this.hasError = true;
      } else {
        this.dialogRef.close(data);
      }
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        width: '25rem',
        data: "Are you sure you want to delete menu: " + this.data.name + "?"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.dialogRef.close(DELETE);
        }
      });
    }
}
