import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/components/confirmation/confirmation.component';
import { MenuItem } from 'src/entities/menuItem';

const DELETE = 'DELETE';

@Component({
  selector: 'app-menu-item-dialog',
  templateUrl: './menu-item-dialog.component.html',
  styleUrls: ['./menu-item-dialog.component.css']
})
export class MenuItemDialog implements OnInit {

  ngOnInit(): void {
  }

  constructor(
    public dialogRef: MatDialogRef<MenuItemDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: MenuItem) {}

    onNoClick(): void {
      this.dialogRef.close(undefined);
    }

    save(data: MenuItem) : void {
      this.dialogRef.close(data);
    }

    openDialog(): void {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        width: '25rem',
        data: "Are you sure you want to delete item: " + this.data.name + "?"
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.dialogRef.close(DELETE);
        }
      });
    }

  

}
