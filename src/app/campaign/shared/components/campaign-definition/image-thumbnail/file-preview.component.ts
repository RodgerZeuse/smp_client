import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from "@angular/core";
import { MediaAssetViewUtil } from "./../../../../../shared/mediaAssetUtil/mediaAssetViewUtil";
import { Observable } from "rxjs";
import { VideoPreviewPopupComponent } from "../../../../../shared/video-preview-popup/video-preview-popup.component";
import {
  MatChipInputEvent,
  MatDialogConfig,
  MatDialog
} from "@angular/material";
import { UserProfile } from "../../../../../store/user-profile";
import { MediaAssetConversionUtil } from "../../../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
import { MediaFileAssetViewModel } from "../../../models/mediaFileAssetViewModel";

@Component({
  selector: "file-preview",
  templateUrl: "./file-preview.component.html",
  styleUrls: ["./file-preview.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaAssetViewUtil]
})
export class FilePreviewComponent implements OnInit {
  imagePath: any;
  @Input() fileToPlaceThumbnail: MediaFileAssetViewModel;
  @Output() outThumbnail: EventEmitter<any> = new EventEmitter();

  thumbnailSrc: Observable<any>;
  thumbnailObj: any;
  constructor(
    private dialog: MatDialog,
    public mediaAssetViewUtil: MediaAssetViewUtil,
    public mediaAssetsConversinUtil: MediaAssetConversionUtil,
    public profileStore: UserProfile
  ) {
    // alert(this.base64OriginalImage);
  }

  ngOnInit() {
    this.imagePath = require("./../../../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
    this.profileStore.loaderStart();
    if (this.fileToPlaceThumbnail.thumbnailName) {
      
        this.thumbnailSrc = Observable.of(this.imagePath + this.fileToPlaceThumbnail.thumbnailName);
     

      this.profileStore.loaderEnd();
    }
    else if (this.fileToPlaceThumbnail.thumbnailFile && this.fileToPlaceThumbnail.thumbnailFile.base64File && this.fileToPlaceThumbnail.thumbnailFile.base64File.src) {
      
      this.thumbnailSrc = Observable.of(this.fileToPlaceThumbnail.thumbnailFile.base64File.src);
      this.profileStore.loaderEnd();
    } else {
      this.getthumbnail();
      this.thumbnailSrc = this.mediaAssetViewUtil.data;
      if (this.thumbnailSrc) {
        this.thumbnailSrc.subscribe(res => {
          if (res) {
            let base64 = { name: "", src: "", type: "" };
            base64.src = res;
            base64.name = this.fileToPlaceThumbnail.name;
            this.mediaAssetsConversinUtil.base64ToFile(base64).then(file => {
              let thumbnail: MediaFileAssetViewModel= new MediaFileAssetViewModel();
              thumbnail.file = file;
              base64.type = file.type;
              thumbnail.base64File = base64;
              this.outThumbnail.emit(thumbnail);
              this.profileStore.loaderEnd();
            });
          }
        });
      }
    }

    console.log(this.thumbnailSrc);
  }
  openImagePopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.fileToPlaceThumbnail.base64File;
    const dialogRef = this.dialog.open(
      VideoPreviewPopupComponent,
      dialogConfig
    );
  }
  getthumbnail() {
    this.mediaAssetViewUtil.getImageThumbnail(
      this.fileToPlaceThumbnail.base64File.src,
      this.fileToPlaceThumbnail.name
    );
    // console.log("thumbnail", this.thumbnailSrc);
  }
}
