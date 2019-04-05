import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
} from '@angular/material';
import {MaterialModule} from '../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubHeaderComponent} from './sub-header/sub-header.component';
import {PaymentInformationComponent} from './payment-information/payment-information.component';
import {GlobalDialogComponent} from './global-dialog/global-dialog.component';
// import {CropperComponent} from '../shared/cropper/cropper.component';
// import {PopUpComponent} from './pop-up/pop-up.component';
import {TextMaskModule} from 'angular2-text-mask';
import {ActivityLogComponent} from './activity-log/activity-log.component';
import {SharedService} from './service/shared-service';
import {VideoPreviewPopupComponent} from './video-preview-popup/video-preview-popup.component';

import {CampaignActivityComponent} from './campaign-activity/campaign-activity.component';
import { MediaAssetViewUtil } from './mediaAssetUtil/mediaAssetViewUtil';
import { MediaAssetConversionUtil } from "./mediaAssetUtil/mediaAssetConversionUtil";
import {PostComponent} from './post/post.component';
import {CommentsContanierComponent} from './comments/comments-contanier/comments-contanier.component';
import {CommentComponent} from './comments/comment/comment.component';
import {ComposeCommentComponent} from './comments/compose-comment/compose-comment.component';
import {DamiCommentComponent} from './comments/comment/dami-comment/dami-comment.component';

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
    PaymentInformationComponent,
    GlobalDialogComponent,
    // CropperComponent,
    // PopUpComponent,
    ActivityLogComponent,
    VideoPreviewPopupComponent,
    CampaignActivityComponent,
    PostComponent,
    CommentsContanierComponent,
    CommentComponent,
    ComposeCommentComponent,
    DamiCommentComponent
  ],
  providers: [
    SharedService, {
      provide: 'util', useClass: MediaAssetViewUtil}, MediaAssetConversionUtil
  ],
  exports: [
    SubHeaderComponent,
    PaymentInformationComponent,
    // CropperComponent,
    // PopUpComponent,
    ActivityLogComponent,
    CampaignActivityComponent,
    PostComponent,
    CommentsContanierComponent,
    CommentComponent,
    ComposeCommentComponent,
    DamiCommentComponent
  ],
  entryComponents: [GlobalDialogComponent,  VideoPreviewPopupComponent]

})
export class SharedModule {}