import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatSlideToggleModule
} from "@angular/material";
import { MaterialModule } from "../material.module";
import { SocialMediaDetailsSelecterComponent } from "./social-media-connector/social-media-details-selecter/social-media-details-selecter.component";
import { MyNetworksContainerComponent } from "./my-networks-container/my-networks-container.component";
import { MyNetworkComponent } from "./my-networks/my-networks.component";
import { AddNetworksComponent } from "./add-networks/add-networks.component";
import { MyNetworksRoutingModule } from "./my-networks.routes";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FacebookConnectorComponent } from "./social-media-connector/facebook-connector/facebook-connector.component";
import { SocialMediaService } from "./social-media-connector/service/social-media.service";
import { YoutubeConnectorComponent } from "./social-media-connector/youtube-connector/youtube-connector.component";
import { InstagramConnectorComponent } from "./social-media-connector/instagram-connector/instagram-connector.component";
import { SocialMediaConnectorComponent } from "./social-media-connector/social-media-connector";
import { SharedModule } from "../shared/shared.module";
import { MyNekworkStatusComponent } from "./my-nekwork-status/my-nekwork-status.component";
import { SearchAccountComponent } from "./search-account/search-account.component";
import { TwitterConnectorComponent } from "./social-media-connector/twitter-connector/twitter-connector.component";
import { PinterestConnectorComponent } from "./social-media-connector/pinterest-connector/pinterest-connector.component";
import { LinkedinConnectorComponent } from "./social-media-connector/linkedin-connector/linkedin-connector.component";
@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatIconModule,
    MaterialModule,
    MatListModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MyNetworksRoutingModule,
    SharedModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  declarations: [
    LinkedinConnectorComponent,
    SocialMediaDetailsSelecterComponent,
    SearchAccountComponent,
    MyNekworkStatusComponent,
    MyNetworksContainerComponent,
    MyNetworkComponent,
    AddNetworksComponent,
    FacebookConnectorComponent,
    YoutubeConnectorComponent,
    InstagramConnectorComponent,
    SocialMediaConnectorComponent,
    TwitterConnectorComponent,
    PinterestConnectorComponent
  ],
  providers: [SocialMediaService],
  exports: [SearchAccountComponent],
  entryComponents: [SocialMediaDetailsSelecterComponent]
})
export class MyNetworksModule {}
