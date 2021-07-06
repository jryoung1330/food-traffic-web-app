import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'src/entities/menuItem';

@Component({
  selector: 'app-vendor-menu-item',
  templateUrl: './vendor-menu-item.component.html',
  styleUrls: ['./vendor-menu-item.component.css']
})
export class VendorMenuItemComponent implements OnInit {

  @Input('item') item: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }

}
