import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { error } from 'protractor';
import { SocialMediaService } from '../service/social-media.service';
declare var IN:any;
@Component({selector: 'linkedin-connector', templateUrl: './linkedin-connector.component.html', styleUrls: ['./linkedin-connector.component.css']})
export class LinkedinConnectorComponent implements OnInit {
  icons : object = {};
  @Output()networkInfo : EventEmitter < object > = new EventEmitter < object > ();
  @Output()isUpdateList : EventEmitter < boolean > = new EventEmitter < boolean > ();
  @Output()onLoaderEnable : EventEmitter < boolean > = new EventEmitter < boolean > ();
  constructor(public socialMediaService:SocialMediaService) {}

  ngOnInit() {
    this.icons = require("./../../../shared/config/icons.json").icons;
  }
  onLinkedInLoad = () => {
    window.location.href = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77g7k13xjls3dk&redirect_uri=http://localhost:4200/my-networks&state=987654321&scope=r_basicprofile+r_emailaddress";
  
    //  
    // IN.User.authorize((res) =>{
    //    
    // }, (scope) =>{
    //    
    // });
    IN.Event.onOnce(IN,"auth",function (res){
       
      console.log(res);
    })
  }
  getProfileData = () =>{
    // IN.API.profile("me").fields("id","first-name","last-name","headline","location","picture-url","public-profile-url","email-address").result(this.displayProfileData).error(console.log("linked error",error))
  }
  displayProfileData = (data) =>{
     
    console.log(data);
  }
  // getUserInfo = () => {

  // }

  // getOauthToken = () => {

  // }
}
