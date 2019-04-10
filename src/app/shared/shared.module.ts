import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatGridListModule,
  MatIconModule,
  MatIcon,
  MatSidenavModule,
  MatListModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatCardModule,
  MatSlideToggleModule
} from "@angular/material";
import { MaterialModule } from "../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SubHeaderComponent } from "./sub-header/sub-header.component";
import { GlobalDialogComponent } from "./global-dialog/global-dialog.component";
// import {CropperComponent} from '../shared/cropper/cropper.component';
// import {PopUpComponent} from './pop-up/pop-up.component';
import { TextMaskModule } from "angular2-text-mask";
import { SharedService } from "./service/shared-service";
import { VideoPreviewPopupComponent } from "./video-preview-popup/video-preview-popup.component";
import { MediaAssetViewUtil } from "./mediaAssetUtil/mediaAssetViewUtil";
import { MediaAssetConversionUtil } from "./mediaAssetUtil/mediaAssetConversionUtil";
import { PostComponent } from "./post/post.component";

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatIconModule,
    MaterialModule,
    MatListModule,
    TextMaskModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule
  ],
  declarations: [
    SubHeaderComponent,
    GlobalDialogComponent,
    // CropperComponent,
    // PopUpComponent,
    VideoPreviewPopupComponent,
    PostComponent
  ],
  providers: [
    SharedService,
    {
      provide: "util",
      useClass: MediaAssetViewUtil
    },
    MediaAssetConversionUtil
  ],
  exports: [SubHeaderComponent, PostComponent],
  entryComponents: [GlobalDialogComponent, VideoPreviewPopupComponent]
})
export class SharedModule {}
