import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/entity/tag';

@Component({
  selector: 'app-vendor-tag-card',
  templateUrl: './vendor-tag-card.component.html',
  styleUrls: ['./vendor-tag-card.component.css']
})
export class VendorTagCardComponent implements OnInit {

  @Input('tag') tag: Tag;

  constructor() { }

  ngOnInit(): void {
  }

}
