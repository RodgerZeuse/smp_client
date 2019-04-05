import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '../../store/user-profile';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  // isOpenSocialPlatformList:boolean;

  groupRights = require("../../shared/config/group-rights.json").groupRights;

  constructor(public router: Router, private profileStore: UserProfile) {    
    // this.isOpenSocialPlatformList = false;
  }


  // openSocialPlatformList(){
  //   this.isOpenSocialPlatformList = !this.isOpenSocialPlatformList
  // }
  gotoCompanyManagment() {
    this.router.navigateByUrl("manage-company");
  }
  gotoCamapign() {
    this.router.navigateByUrl("campaign/campaign-list");
  }
  gotoMyNetworks() {
    this.router.navigateByUrl("my-networks");
  }
  gotoCamapignStatus() {
    this.router.navigateByUrl("campaign-status");
  }
  gotoPostToQueue() {
    this.router.navigateByUrl("campaign/post-queue");
  }
  gotoNetworkDetails() {
    this.router.navigateByUrl("my-networks/network/details");
  }
}
