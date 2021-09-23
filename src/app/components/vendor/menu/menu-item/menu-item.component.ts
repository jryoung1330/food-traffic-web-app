import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { MenuItem } from 'src/entities/menuItem';

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
      width: '30rem',
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

@Component({
  selector: 'menu-item-dialog',
  templateUrl: 'menu-item-dialog.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemDialog {
  constructor(
    public dialogRef: MatDialogRef<MenuItemDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: MenuItem) {}

    onNoClick(): void {
      this.dialogRef.close(undefined);
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        width: '25rem',
        data: this.data
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.dialogRef.close(DELETE);
        }
      });
    }
    
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
  styleUrls: ['./menu-item.component.css']
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MenuItem) {}

    onNoClick(): void {
      this.dialogRef.close(undefined);
    }

    delete(): void {
      this.dialogRef.close(true);
    }
}
