import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OperationService } from 'src/app/services/operation.service';
import { VendorService } from 'src/app/services/vendor.service';
import { Menu } from 'src/entities/menu';
import { OperationItem } from 'src/entities/operationItem';
import { Tag } from 'src/entities/tag';
import { Vendor } from 'src/entities/vendor';
import { MenuDialog } from '../menu/menu-dialog/menu-dialog.component';
import { EventDialog } from '../operations/event-dialog/event-dialog.component';
import { TagDialog } from '../tag/tag-dialog/tag-dialog.component';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class VendorProfileComponent implements OnInit {

  vendor: Vendor;
  menus: Menu[];
  hoursOfOperation: OperationItem[];
  currentDate: OperationItem;
  events: OperationItem[];
  upcomingEvents: OperationItem[] = [];
  path: string;
  editDisplayName: boolean;
  editDescription: boolean;

  constructor(private vendorService: VendorService,
              private opService: OperationService,
              private menuDialog: MatDialog,
              private eventDialog: MatDialog,
              private tagDialog: MatDialog) {
    // set up for all components
    this.vendorService.vendor$.subscribe((payload) => {
      if(payload && payload.id) {
        this.vendor = payload;
        this.getHoursOfOperation(payload);
        this.getEvents();
        this.getMenus(payload);
      }
    });
  }

  ngOnInit(): void {
    this.path = window.location.pathname;

    this.vendorService.menu$.subscribe((payload) => {
      this.menus = payload;
    });

    this.opService.events$.subscribe((payload) => {
      this.events = this.opService.convertOperations(payload);

      // only add events that have not yet occurred
      this.upcomingEvents = [];
      let today = new Date();
      this.events.forEach(event => {
        if(event.startDate >= today) {
          this.upcomingEvents.push(this.opService.convertOperation(new Date(), event));
        }
      });
    });
  }

  getEvents() {
    this.opService.getEventsForMonthSub(window.location.pathname, new Date());
  }

  getHoursOfOperation(vendor: Vendor) {
    if (vendor) {
      this.opService.getHoursOfOperation(vendor.id, "week")
        .subscribe((payload: OperationItem[]) => {
          if(payload !== null) {
            this.hoursOfOperation = this.opService.convertOperations(payload);
            this.hoursOfOperation.forEach(op => {
              if(op.dayOfWeek === DAYS[new Date().getDay()]) {
                this.currentDate = op;
              }
            });
          } else {
            this.hoursOfOperation = null;
          }
        });
    } else {
      this.hoursOfOperation = null;
    }
  }
 
  getMenus(vendor: Vendor) {
    if (vendor !== undefined && vendor !== null) {
      this.vendorService.getMenusForSub(vendor.id);
    } else {
      this.menus = [];
    }
  }

  // @click
  createMenu(menu: Menu) {
    if(menu.name != null && menu.name.length !== 0) {
      menu.vendorId = this.vendor.id;
      menu.displayOrder = this.menus.length;
      this.vendorService.createMenu(window.location.pathname, menu).subscribe((payload) => {
        this.menus.push(payload);
      });
    } else {
      // TODO: handle error
    }
  }

  // @template
  spaceOut(name: String) : String {
    let newName = "";
    for(let i=0; i<name.length; i++) {
      newName += name.charAt(i) + " ";
    }
    return newName.trim();
  }

  // @click
  openMenuDialog(): void {
    let newMenu = new Menu();
    newMenu.displayOrder = this.menus.length;

    const dialogRef = this.menuDialog.open(MenuDialog, {
      width: '30%',
      height: '32%',
      data: newMenu
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.createMenu(newMenu);
      }
    });
  }

  // @template
  drop(event: CdkDragDrop<Menu[]>) {
    moveItemInArray(this.menus, event.previousIndex, event.currentIndex);
    this.setDisplayOrder(this.menus);
  }

  setDisplayOrder(menus : Menu[]) : void {
    for(let i=0; i<menus.length; i++) {
      menus[i].displayOrder = i;
      this.vendorService.updateMenu(window.location.pathname, menus[i]).subscribe((payload) => menus[i] = payload);
    }
  }

  // @click
  createEvent() {
    let opItem  = new OperationItem();
    opItem.eventStartDate = new Date();
    opItem.eventEndDate = new Date();

    const dialogRef = this.eventDialog.open(EventDialog, {
      width: '35%',
      height: '45%',
      data: {
        opItem: opItem,
        editMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.opService.handleCreate(opItem, this.vendor.id, this.path)
          .subscribe((payload) => {
            this.opService.getEventsForMonthSub(this.path, new Date());
          });
      }
    });
  }

  // @click
  updateVendorDisplayName(updated: boolean) {
    this.editDisplayName=false;
    if(updated) {
      this.vendorService.updateVendorForSub(this.vendor);
    }
  }

  //@click
  updateVendorDescription(updated: boolean) {
    this.editDescription=false;
    if(updated) {
      this.vendorService.updateVendorForSub(this.vendor);
    }
  }

  //@click
  openTagDialog(): void {
    let tags : Array<Tag> = [];
    this.vendor.tags.forEach((t) => {
      tags.push(t);
    });
    const dialogRef = this.tagDialog.open(TagDialog, {
      width: '35%',
      height: '50%',
      data: tags
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.vendor.tags = tags;
        this.vendorService.updateVendorForSub(this.vendor);
      }
    });
  }
}
