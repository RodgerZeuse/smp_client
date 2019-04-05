import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'social-network-image-cropper',
  templateUrl: './social-network-image-cropper.component.html',
  styleUrls: ['./social-network-image-cropper.component.css']
})
export class SocialNetworkImageCropperComponent implements OnInit {
  icons: object = {};
  isChecked: boolean;
  croppedImg: Array<any>;
  selectedTab: string;
  previusSelectedTab: string;
  selectedRatio: string;
  constructor(public dialogRef: MatDialogRef<SocialNetworkImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    // console.log(data)

  }

  ngOnInit() {
    this.icons = require("./../../../../../shared/config/icons.json").icons;
    this.isChecked = false;
  }
  changeCropBox(value) {


    if (value === false) {
      this.isChecked = true;
      this.selectedTab = "";
      // console.log("check box value", this.isChecked)
    }
    else {
      this.selectedTab = this.previusSelectedTab;
      this.isChecked = false;
      // console.log("check box value", this.isChecked)
    }

  }
  changeRatio(event) {
    // console.log("change ratio", this.selectedRatio)
  }
  getCroppedImage(event) {
    this.croppedImg = [];
    // console.log("cropped image", event)
    this.croppedImg = event;
    this.dialogRef.close(this.croppedImg);
  }
  imagePreview(event) {
    this.croppedImg = [];
    if (event.selectedImage) {
      for (let i = 0; i < event.length; i++) {
        if (event[i].type === event.selectedImage) {
          this.croppedImg.push(event[i]);
        }
      }

    } else {
      this.croppedImg = event;
    }

  }
  selectdTab(type) {
    this.selectedTab = type;
    this.previusSelectedTab = this.selectedTab;
  }
}
