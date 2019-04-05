import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { SocialNetworkImageCropperComponent } from './../socialNetworkImageCropper/social-network-image-cropper.component';


@Component({
  selector: 'cropper-wrapper',
  templateUrl: './cropper-wrapper.component.html',
  styleUrls: ['./cropper-wrapper.component.css']
})
export class CropperWrapperComponent implements OnInit {

  @Input() socialNetwork$: Observable<Array<any>>;
  @Input() imageForCropper$: Observable<any>;
  @Output() croppedImage: EventEmitter<any> = new EventEmitter();

  socialNetworks: Array<string> = [];
  imageForCropper

  cropOption: any;
  constructor(public dialog: MatDialog) {


  }

  ngOnInit() {
    this.imageForCropper$.subscribe(image => {
      if (image != null) {
        this.openImageCropperPopup(image);
      }
    })

    this.socialNetwork$.subscribe(socialNetworks => {
      this.socialNetworks = socialNetworks;
    })
  }

  openImageCropperPopup(img) {


    if (this.socialNetworks) {
      this.cropOption = {
        name: img.name,
        image: img.src,
        minWidth: 200,
        minHeight: 300,
        width: 500,
        height: 500,
        x: 100,
        y: 500,
        aspectRatio: 1 / 1,
        isChecked: false,
        bounds: {
          width: '100%',
          height: '50%'
        },
        platform: this.socialNetworks
      }
      this.openDialog();
    }



  }

  openDialog = () => {
    console.log(this.cropOption);
    const dialogRef = this.dialog.open(SocialNetworkImageCropperComponent, {
      width: '600',
      height: '600',
      panelClass: 'custom-dialog-container',
      data: this.cropOption
    });
    dialogRef.afterClosed().subscribe(result => {
      let self = this;
      this.imageForCropper$ = null;
      for (let i = 0; i < result.length; i++) {
        if (result[i].type) {
          this.croppedImage.emit(result[i]);
        }
      }

    });

  }

}
