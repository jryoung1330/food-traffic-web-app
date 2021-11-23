import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/entities/tag';

@Component({
  selector: 'app-vendor-tag-card',
  templateUrl: './vendor-tag-card.component.html',
  styleUrls: ['./vendor-tag-card.component.css']
})
export class VendorTagCardComponent implements OnInit {

  @Input('tag') tag: Tag;
  @Input('selected') selected: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSelect() {
    this.selected = !this.selected;
  }
}
