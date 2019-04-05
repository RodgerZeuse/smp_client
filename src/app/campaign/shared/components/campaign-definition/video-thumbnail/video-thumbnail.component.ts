import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaAssetViewUtil } from './../../../../../shared/mediaAssetUtil/mediaAssetViewUtil';
import { MatChipInputEvent, MatDialogConfig, MatDialog } from '@angular/material';
import { VideoPreviewPopupComponent } from '../../../../../shared/video-preview-popup/video-preview-popup.component';
import { Observable } from 'rxjs';
import { UserProfile } from "../../../../../store/user-profile";
import { MediaAssetConversionUtil } from "./../../../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
import { MediaFileAssetViewModel } from '../../../models/mediaFileAssetViewModel';
declare var $: any;
@Component({
  selector: 'video-thumbnail',
  templateUrl: './video-thumbnail.component.html',
  styleUrls: ['./video-thumbnail.component.css'],
  providers: [MediaAssetViewUtil]
})
export class VideoThumbnailComponent implements OnInit {
  filePath: any;
  @Input() fileToPlaceThumbnail: MediaFileAssetViewModel;
  vidObj: any;
  URL: any

  @Output() outThumbnail: EventEmitter<any> = new EventEmitter();

  thumbnailSrc: Observable<any>;

  thumbnail: any;
  constructor(public profileStore: UserProfile,public mediaAssetConversionUtil:MediaAssetConversionUtil,
    public mediaAssetViewUtil: MediaAssetViewUtil, private domSanitizer: DomSanitizer, private dialog: MatDialog) {
    // setTimeout(function () {
    //   let videoDiv = document.getElementById('videoThumbnail');
    //   this.util.loadImage(videoDiv,"test.mp4")
    //   console.log(videoDiv);

    //  console.log(this.util.loadImage(videoDiv,"test.mp4"));
    // }.bind(this), 2000);

  }

  ngOnInit() {
    this.profileStore.loaderStart();
    this.filePath = require("./../../../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL
    if(this.fileToPlaceThumbnail.thumbnailName){
      
        this.thumbnailSrc = Observable.of(this.filePath + this.fileToPlaceThumbnail.thumbnailName);
     
      
      this.vidObj = this.fileToPlaceThumbnail;
      this.profileStore.loaderEnd()
    } else if (this.fileToPlaceThumbnail.thumbnailFile) {
      this.thumbnailSrc = Observable.of(this.fileToPlaceThumbnail.thumbnailFile.base64File.src);
      this.vidObj = this.fileToPlaceThumbnail.file;
      this.profileStore.loaderEnd()

    }else {
      this.URL = window.URL || (window as any).webkitURL

      this.playSelectedFile();

      this.thumbnailSrc = this.mediaAssetViewUtil.data;
      if (this.thumbnailSrc) {
        this.thumbnailSrc.subscribe(res => {
          if (res) {
            let base64 = { name: '', src: '', type:'' };
            base64.src = res;
            base64.name = this.fileToPlaceThumbnail.name.substr(0, this.fileToPlaceThumbnail.name.lastIndexOf('.')) + '.png';
            this.mediaAssetConversionUtil.base64ToFile(base64).then(file => {
             let thumbnail:MediaFileAssetViewModel=new MediaFileAssetViewModel();
             thumbnail.file=file;
             base64.type ='image/png';
             thumbnail.base64File=base64;
              this.outThumbnail.emit(thumbnail);
              this.profileStore.loaderEnd()
            })
            // fetch(base64)
            //   .then(res => res.blob())
            //   .then(blob => {
            //     var f = this.file.name.substr(0, this.file.name.lastIndexOf('.'));

            //     let convertedFile = new File([blob], f + '.png', { type: 'image/png' });
            //     this.outThumbnail.emit(convertedFile);
            //     this.profileStore.loaderEnd()


            //   })
          }

        })


      }
    }


  }


  playSelectedFile = () => {

    let type = this.fileToPlaceThumbnail.type


    let fileURL: any = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.fileToPlaceThumbnail.file));
    this.vidObj = {
      "src": fileURL,
      "type": type
    }

    var videoDiv: any = document.createElement('video');
    videoDiv.setAttribute("controls", "controls");
    videoDiv.setAttribute("id", 'video1');

    // $("#showVideo").append(videoDiv);

    videoDiv.setAttribute("src", fileURL.changingThisBreaksApplicationSecurity);

    setTimeout(function () {


      if (videoDiv.canPlayType("video/mp4")) {

        console.log("video object", videoDiv);
        //   videoDiv.addEventListener('canplay', function () {

        // });

        let canvas: any = document.createElement('canvas');
        canvas.getContext('2d').drawImage(videoDiv, 0, 0, videoDiv.videoWidth, videoDiv.videoHeight);
        let img: any = document.getElementById("test");
        img.src = canvas.toDataURL();
        this.thumbnail = this.mediaAssetViewUtil.getImageThumbnail(img.src, 'thumbnail')
        console.log(this.thumbnail);
        document.getElementById("showVideo").style.display = "none";
        // document.getElementById("canvas").style.display = "none";

      }
      // else {
      //   videoDiv.setAttribute("src", fileURL.changingThisBreaksApplicationSecurity);
      // }
    }.bind(this), 2000);

  }

  openVideoPopup(video) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = video;
    const dialogRef = this.dialog.open(VideoPreviewPopupComponent, dialogConfig);

  }
}
