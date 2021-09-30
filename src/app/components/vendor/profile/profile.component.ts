import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { Operation } from 'src/entities/operation';
import { OperationItem } from 'src/entities/operationItem';
import { Vendor } from 'src/entities/vendor';
import { MenuDialog } from '../menu/menu.component';

const MILLISECONS_TO_HOURS : number = 36000000;
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class VendorProfileComponent implements OnInit {

  vendor: Vendor;
  operationItems: OperationItem[];
  menus: Menu[];
  today: OperationItem;

  constructor(private vendorService: VendorService, public menuDialog: MatDialog) { }

  ngOnInit(): void {
    this.vendorService.menu$.subscribe((payload) => {
      this.menus = payload;
    });

    this.vendorService.getVendor(window.localStorage.getItem('vendor')).subscribe((payload) => {
      this.vendor = payload;
      this.getHoursOfOperation(payload);
      this.getMenus(payload);
    });
  }

  getHoursOfOperation(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.vendorService.getHoursOfOperation(vendor.id, "week").subscribe((payload: Operation) => {
        if(payload !== null) {
          this.operationItems = this.convertOperations(payload.operationItems);
        } else {
          this.operationItems = null;
        }
        
      });
    } else {
      this.operationItems = null;
    }
  }

  convertOperations(operationItems: OperationItem[]) {
    let now = new Date();
    operationItems.forEach(op => {
      if(op.dayOfWeek === DAYS[now.getDay()]) {
        this.today = op;
      }

      if(!op.closed) {
        let closeTime = new Date();
        closeTime.setHours(this.getHours(op.closeTime), this.getMinutes(op.closeTime), 0, 0);
        op.closeDateTime = closeTime;
        op.timeLeft = (op.closeDateTime.valueOf() - now.valueOf()) / MILLISECONS_TO_HOURS;

        let openTime = new Date();
        openTime.setHours(this.getHours(op.openTime), this.getMinutes(op.openTime), 0, 0);
        op.openDateTime = openTime;
      }
    });
    return operationItems;
  }

  getHours(time : String) : number {
    return parseInt(time.split(':')[0]);
  }

  getMinutes(time: String) : number {
    return parseInt(time.split(':')[1]);
  }
 
  getMenus(vendor: Vendor) {
    if (vendor !== undefined || vendor !== null) {
      this.vendorService.getMenusForSub(vendor.id);
    } else {
      this.menus = [];
    }
  }

  createMenu(menu: Menu) {
    if(menu.name != null && menu.name.length !== 0) {
      menu.vendorId = this.vendor.id;
      if(menu.displayOrder > this.menus.length) menu.displayOrder = this.menus.length;
      this.vendorService.createMenu(window.location.pathname, menu).subscribe((payload) => {
        this.menus.push(payload);
      });
    } else {
      // TODO: handle error
    }
  }

  spaceOut(name: String) : String {
    let newName = "";
    for(let i=0; i<name.length; i++) {
      newName += name.charAt(i) + " ";
    }
    return newName.trim();
  }

  pad(num: String, size: number) {
    while (num.length < size) num = "0" + num;
    return num;
  }

  convert12Hour(num: number) {
    return num > 12 ? num - 12 : num;
  }

  getTimeOfDay(num: number) {
    return num >= 12 ? 'PM' : 'AM';
  }

  convertTime(time: String) {
    if(time === null) return '';
    const hours = this.convert12Hour(+time.substr(0, time.indexOf(":")));
    const minutes = this.pad(time.substr(time.indexOf(":") + 1), 2);
    return hours + ':' + minutes + ' ' + this.getTimeOfDay(+time.substr(0, time.indexOf(":")));
  }

  openDialog(): void {
    let newMenu = new Menu();
    newMenu.displayOrder = this.menus.length;

    const dialogRef = this.menuDialog.open(MenuDialog, {
      width: '30rem',
      data: newMenu
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.createMenu(newMenu);
      }
    });
  }
}
