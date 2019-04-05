import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-video-preview-popup',
  templateUrl: './video-preview-popup.component.html',
  styleUrls: ['./video-preview-popup.component.css']
})
export class VideoPreviewPopupComponent implements OnInit {
  // img: any = {};
  imagePath='';
  img:Observable<any>;
  constructor(private dialogRef: MatDialogRef<VideoPreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.img = data;
  }

  ngOnInit() {
    this.imagePath = require("./../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
  }

  close() {
    this.dialogRef.close('close');
  }

}
