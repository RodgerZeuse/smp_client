import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { MediaFileAssetViewModel } from '../../../models/mediaFileAssetViewModel';
@Component({
  selector: 'image-tagging',
  templateUrl: './image-tagging.component.html',
  styleUrls: ['./image-tagging.component.css']
})

export class ImageTaggingComponent implements OnInit {
  tag: string;
  tags: Array<object>;
  x: number;
  y: number;
  constructor(public dialogRef: MatDialogRef<ImageTaggingComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.tags = [];
    console.log(data)

  }

  ngOnInit() {
    if (this.data.files.base64File.tags) {
      if (this.data.files.base64File.tags.length > 0) {
        for (let i = 0; i < this.data.files.base64File.tags.length; i++) {
          this.tags = this.data.files.base64File.tags;
        }
      }
    }
  }
  addTags = (e) => {
    $("#mapper").css({ "display": "none" })
    let obj = {
      "id":UUID.UUID(),
      "x": this.x,
      "y": this.y,
      "tag_text": this.tag
    }
    this.tags.push(obj);




  }
  mouseDown = ($event) => {
    let div = document.getElementById($event.target.id)
    let coordinates = div.getBoundingClientRect();
    this.tag = "";
    this.x = ($event.pageX - 20);
    this.y = ($event.pageY - 20);
    $("#mapper").css({ "display": "block", "position": "fixed", "top": ($event.pageY - 20), "left": ($event.pageX - 20) })
  }
  removeTag = (i) => {
    this.tags.splice(i, 1);
  }
  publishTags() {
    if (this.tags.length > 0) {
      let obj = {
        "name": this.data.files.name,
        "tags": this.tags,
        "imageIndex": this.data.imgIndex
      }
      this.dialogRef.close(obj);
    }

  }
}
