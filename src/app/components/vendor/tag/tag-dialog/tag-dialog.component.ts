import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendorService } from 'src/app/services/vendor.service';
import { ResponseMetaData } from 'src/entities/metadata';
import { Tag } from 'src/entities/tag';

@Component({
  selector: 'app-tag-dialog',
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.css']
})
export class TagDialog implements OnInit {

  searchKey: string;
  allTags: Array<Tag>;
  tagIds: number[] = [];
  meta: ResponseMetaData;
  changed: boolean;

  constructor(public dialogRef: MatDialogRef<TagDialog>,
              public dialog: MatDialog,
              private vendorService: VendorService,
              @Inject(MAT_DIALOG_DATA) public data: Array<Tag>) {
    this.data.forEach((t) => {
      this.tagIds.push(t.id);
    });
  }

  ngOnInit(): void {
    this.vendorService.getAllTags().subscribe((payload) => {
      this.allTags = payload.data;
      this.meta = payload._meta;
    });
  }

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }

  save(): void {
    this.dialogRef.close(this.changed);
  }

  searchTags(value: string) {
    this.vendorService.getAllTagsByName(value).subscribe((payload) => {
      this.allTags = payload.data;
      this.meta = payload._meta;
    });
  }

  movePrevPage() {
    if(this.meta.prev) {
      this.vendorService.getTagsForPage(this.meta.prev).subscribe((payload) => {
        this.allTags = payload.data;
        this.meta = payload._meta;
      });
    }
  }

  moveNextPage() {
    if(this.meta.next) {
      this.vendorService.getTagsForPage(this.meta.next).subscribe((payload) => {
        this.allTags = payload.data;
        this.meta = payload._meta;
      });
    }
  }

  addOrRemove(tag: Tag) {
    this.changed = true;
    let index = -1;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].name == tag.name) {
        index = i;
        break;
      }
    }

    if(index < 0) {
      this.data.push(tag);
    } else {
      this.data.splice(index, 1);
    }
  }
}
