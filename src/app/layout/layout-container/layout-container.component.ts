import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DashboardService } from "../services/dasboard.service"
import { UserProfile } from "../../store/user-profile";
import {Socket} from 'ng-socket-io';
import { CampaignsStore } from '../../store/campaigns-store';
@Component({
  selector: 'app-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.css']
})
export class LayoutContainerComponent implements OnInit {
  opened: boolean;
  isMenuClose: boolean;
  isProfileDetial: boolean;
  currentRouteName: string;
  isActiveLogOpen: boolean;
  isCommentsShow: boolean;
  counter:number = 0;
  @HostListener('window:click', ['$event'])
  onClickEvent(e) {
    // console.log("documnet click capture", e)
    if (e.target.id != "profileDiv") {
      this.isProfileDetial = false;
    }
  }
  constructor(public socket: Socket,public profileStore: UserProfile, public router: Router, public activatedRoute: ActivatedRoute,public campaignStore:CampaignsStore) {
    this.opened = true;
    this.isMenuClose = false;
    this.isProfileDetial = false;
  }

  ngOnInit() {
    this
    .socket
    .on("new create campaign", (newCamp) => {
      if(this.counter === 0){
        this.campaignStore.getNewCampaing(newCamp.newCampaign);
        this.profileStore.isCampaignCreate = true;
        this.counter ++;
      }
      
    })
    setInterval(() => {
      this.profileStore.isCampaignCreate = false;
      this.counter = 0;
    },15000)
    this.isActiveLogOpen = false;
    this.isCommentsShow = false;
    // this.profileStore.loader=true;
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .subscribe((event) => {
        if (event.routeConfig.data) {
          if (localStorage.getItem('route') && event.routeConfig.data.name == 'Edit Campaign') {
            this.currentRouteName = localStorage.getItem('route');
          } else {
            this.currentRouteName = event.routeConfig.data.name;
          }
        }
      });
    if (this.router.url) {
      let currentUrl = this.router.url;
      if (currentUrl === "/my-networks") {
        this.currentRouteName = "My Networks"
      }
      else if (currentUrl === "/campaign/campaign-list") {
        this.currentRouteName = "My Campaigns"
      }
      else if (currentUrl == "/campaign/edit-campaign" && !localStorage.getItem('route')) {
        this.currentRouteName = "Edit Campaigns"
      }
      else if (currentUrl == "/campaign/edit-campaign" && localStorage.getItem('route')) {
        this.currentRouteName = localStorage.getItem('route');
      }
      else if (currentUrl === "/campaign") {
        this.currentRouteName = "Create Campaigns"
      }
      else if (currentUrl === "/manage-company") {
        this.currentRouteName = "Manage Company";
      }
      else if (currentUrl === "/campaign-status") {
        this.currentRouteName = "Custom Campaign Status";
      }
      else if (localStorage.getItem('route')) {
        this.currentRouteName = localStorage.getItem('route');
      }
      // else {
      //   this.currentRouteName = 'Dashboard';
      // }
    }



  }

  toggleMenu() {
    this.opened = !this.opened;
    this.isMenuClose = !this.isMenuClose;
  }
  showProfileDetail() {
    this.isProfileDetial = !this.isProfileDetial;
  }
  openActiveLog() {
    this.isActiveLogOpen = true;
  }
  closeActiveLog() {
    this.isActiveLogOpen = false;
  }
}
