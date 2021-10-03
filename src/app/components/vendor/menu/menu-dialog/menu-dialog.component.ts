import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/components/confirmation/confirmation.component';
import { Menu } from 'src/entities/menu';

const DELETE = 'DELETE';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.css']
})
export class MenuDialog implements OnInit {

  ngOnInit(): void {
  }

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
