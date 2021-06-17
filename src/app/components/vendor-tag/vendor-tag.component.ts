import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/entity/tag';

@Component({
  selector: 'app-vendor-tag',
  templateUrl: './vendor-tag.component.html',
  styleUrls: ['./vendor-tag.component.css']
})
export class VendorTagComponent implements OnInit {

  @Input('tag') tag: Tag;

  constructor() { }

  ngOnInit(): void {
  }

}
