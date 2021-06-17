import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'src/entity/menuItem';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  @Input('item') item: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }

}
