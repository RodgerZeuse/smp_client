import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { CampaignService } from './shared/service/campaign.service';
import { CampaignRoutingModule } from './campaign.routes';
import { CreateCampaignComponent } from './shared/components/campaign-definition/campaign-definition.component';
import { CreateCampaignContainerComponent } from './CreateCampaign/create-campaign-container/create-campaign-container.component';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule, MatIconModule, MatExpansionModule } from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpModule } from '@angular/http';
import { CampaignListComponent } from './campaign-list/campaign-list/campaign-list.component';
import { CampainListContainerComponent } from './campaign-list/campaign-list-container/campaign-list-container.component';
import { MyAttachedSocialNetworksComponent } from './shared/components/my-attached-social-networks/my-attached-social-networks.component';
import { SharedModule } from '../shared/shared.module';
import { SearchCampaignComponent } from './campaign-list/search-campaign/search-campaign.component';
import { DeleteCampaignComponent } from './campaign-list/delete-campaign/delete-campaign.component';
import { MyNetworkService } from "../membership/service/my-network.service";
import { CampaignDetailsComponent } from './campaign-list/campaign-details/campaign-details.component';
import { CampaignCalendarComponent } from './campaign-list/campaign-calendar/campaign-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatSortModule } from '@angular/material/sort';
import { EditCampaignContainerComponent } from './EditCampaign/edit-campaign-container/edit-campaign-container.component';
// import { CropperWrapperComponent } from './cropper-wrapper/cropper-wrapper.component';
import { GoogleDriveSelectorComponent } from '../external-file-selector/google-drive-selector/google-drive-selector.component';
import { DropBoxSelectorComponent } from '../external-file-selector/drop-box-selector/drop-box-selector.component';
import { ImageTaggingComponent } from './shared/components/campaign-definition/image-tagging/image-tagging.component';
import { PostPreviewComponent } from './shared/components/post-preview/post-preview.component';
import { BoxPopupOpenerComponent } from '../external-file-selector/box-selector/box-popup-opener/box-popup-opener.component';
import { BoxSelectorComponent } from '../external-file-selector/box-selector/box-selector.component';
import { PostQueueComponent } from './post-queue/post-queue/post-queue.component';
import { OneDriveSelectorComponent } from '../external-file-selector/one-drive-selector/one-drive-selector.component';
// import { FilePreviewComponent } from './campaign-definition/image-thumbnail/file-preview.component';
// import { VideoThumbnailComponent } from './campaign-definition/video-thumbnail/video-thumbnail.component';
// import { CampaignTimelineComponent } from './campaign-list/campaign-timeline/campaign-timeline.component';
// import { PostQueueContainerComponent } from './post-queue/post-queue-container/post-queue-container.component';

// import { CampaignSocialAccountsService } from "./service/campaign-social-accounts.service";
// import { TimeSlotDefinitionComponent } from './post-queue/time-slot-definition/time-slot-definition.component';
import { CampaignCommentsInvitationContainerComponent } from './campaign-comments-invitation-container/campaign-comments-invitation-container.component';
import { CampaignInvitationComponent } from './campaign-comments-invitation-container/campaign-invitation/campaign-invitation.component';

import { FilePreviewComponent } from './shared/components/campaign-definition/image-thumbnail/file-preview.component';
import { VideoThumbnailComponent } from './shared/components/campaign-definition/video-thumbnail/video-thumbnail.component';
// import { CommentsContanierComponent } from './comments/comments-contanier/comments-contanier.component';
// import { CommentComponent } from './comments/comment/comment.component';
// import { ComposeCommentComponent } from './comments/compose-comment/compose-comment.component';
import { CampaignTimelineComponent } from './campaign-list/campaign-timeline/campaign-timeline.component';
import { PostQueueContainerComponent } from './post-queue/post-queue-container/post-queue-container.component';
// import { DamiCommentComponent } from './comments/comment/dami-comment/dami-comment.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CampaignSocialAccountsService } from "./shared/service/campaign-social-accounts.service";
import { CampaignContainerService } from './shared/service/campaign-container.service'
import { TimeSlotDefinitionComponent } from './post-queue/time-slot-definition/time-slot-definition.component';
import { CropperWrapperComponent } from "./shared/components/cropper/cropper-wrapper/cropper-wrapper.component";
import { CropperComponent } from "./shared/components/cropper/cropper/cropper.component";
import { SocialNetworkImageCropperComponent } from "./shared/components/cropper/socialNetworkImageCropper/social-network-image-cropper.component";
import { PostListComponent } from './shared/components/post-list/post-list.component';
import { CamapignStatusService } from "./custom-campaign-status/service/camapign-status.service";
import { ArchiveSelectionComponent } from './campaign-list/archive-selection/archive-selection.component';
// import { MediaAssetUtil } from '../shared/mediaAssetUtil/mediaAssetUtil';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CampaignRoutingModule,
    FormsModule, MatSortModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HttpModule,
    MatExpansionModule, CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    SharedModule
  ],

  declarations: [
    BoxPopupOpenerComponent,
    TimeSlotDefinitionComponent,
    OneDriveSelectorComponent,
    DropBoxSelectorComponent,
    GoogleDriveSelectorComponent,
    BoxSelectorComponent,
    CreateCampaignComponent,
    CampaignListComponent,
    CreateCampaignContainerComponent,
    CampainListContainerComponent,
    MyAttachedSocialNetworksComponent,
    SearchCampaignComponent,
    DeleteCampaignComponent,
    CampaignDetailsComponent,
    CampaignTimelineComponent,
    CampaignCalendarComponent,
    EditCampaignContainerComponent,
    CropperWrapperComponent,
    CropperComponent,
    SocialNetworkImageCropperComponent,
    ImageTaggingComponent,
    PostPreviewComponent,
    PostQueueComponent,
    FilePreviewComponent,
    VideoThumbnailComponent,
    PostQueueContainerComponent,
    CampaignCommentsInvitationContainerComponent,
    CampaignInvitationComponent,
    // DamiCommentComponent,
    PostListComponent,
    ArchiveSelectionComponent,
  ],
  providers: [CampaignService, CamapignStatusService, CampaignContainerService, MyNetworkService, CampaignSocialAccountsService, FormBuilder],

  exports: [MyAttachedSocialNetworksComponent],
  entryComponents: [TimeSlotDefinitionComponent, ImageTaggingComponent, CampaignCommentsInvitationContainerComponent, SocialNetworkImageCropperComponent]
})
export class CampaignModule { }
