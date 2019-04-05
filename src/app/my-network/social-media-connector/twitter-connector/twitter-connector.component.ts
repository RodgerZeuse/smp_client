import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MyNetworkService } from '../../../membership/service/my-network.service';
import { UserProfile } from '../../../store/user-profile';
import { SocialMediaService } from '../service/social-media.service';
@Component({
  selector: 'twitter-connector',
  templateUrl: './twitter-connector.component.html',
  styleUrls: ['./twitter-connector.component.css']
})
export class TwitterConnectorComponent implements OnInit {

  socialConfig: any;
  icons: object = {};
  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onLoaderEnable: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public socialMediaService: SocialMediaService, public userProfile: UserProfile, public socialAccountService: MyNetworkService) { }

  ngOnInit() {
    this.icons = require("./../../../shared/config/icons.json").icons;
    this.socialConfig = require("./../../../shared/config/socialNetworkConfig.json").socialConfig;
  }

  twitterOauth() {
    // this.onLoaderEnable.emit(true);
    //  this.socialAccountService.twitterOauth().subscribe(res =>{
    //     console.log("twitter oauth callback res",res);
    //  })
    window.location.href = this.socialConfig.twitterLink;
    // this.socialMediaService.twitterOauth().subscribe(res =>{
    //   console.log(res);
    // })
  }
}
