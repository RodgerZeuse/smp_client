import { Component, OnInit } from '@angular/core';
import { LoopBackConfig,  LoopBackAuth, SDKToken } from './shared/sdk';
import { BASE_URL, API_VERSION } from './shared/sdk/base.url';
import { Router } from '@angular/router';

@Component(
  {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(public auth:LoopBackAuth, private router:Router){
    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);
  }


  title = 'SocialMediaPoster';
  ngOnInit(){
    if(localStorage["userProfile"]){
      let userProfile = JSON.parse(localStorage["userProfile"]);
      this.auth.setToken(<SDKToken>userProfile.currentUserData);
      this.auth.setRememberMe(true);
      this.auth.save();
    }
    
  }
}
