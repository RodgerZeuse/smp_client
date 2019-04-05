import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../../store/user-profile';
import { SocialAccountsStore } from '../../store/social-accounts-store';
import { MyNetworkService } from '../../membership/service/my-network.service';
import { SearchModel } from '../../shared/model/searchModel';
import { SocialMediaAccount } from '../../shared/sdk';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from '../../shared/global-dialog/global-dialog.component';
import { SocialMediaService } from '../social-media-connector/service/social-media.service';
import { SocialMediaDetailsSelecterComponent } from '../social-media-connector/social-media-details-selecter/social-media-details-selecter.component';
import { Router } from '@angular/router';
let errors = require('../message.json')
@Component({
  selector: 'app-my-networks-container',
  templateUrl: './my-networks-container.component.html',
  styleUrls: ['./my-networks-container.component.css']
})

export class MyNetworksContainerComponent implements OnInit {
  socialAccountsDetail: Array<SocialMediaAccount> = [];
  isNetworksListShow: boolean;
  lastSearch: SearchModel;
  access_token: string;
  oauth_verifier: string;
  socialAccountsDetail$ = new BehaviorSubject(this.socialAccountsDetail);
  activeLoader: boolean = false;
  selectedNetwork: string;
  youtubeClient_id: string = "";
  youtubeData: BehaviorSubject<any>;

  constructor(private dialog: MatDialog, public router: Router, public socialAccountsStore: SocialAccountsStore, private myNetworkService: MyNetworkService, public socialMediaService: SocialMediaService, private userProfile: UserProfile) {
    this.isNetworksListShow = false;

  }

  ngOnInit() {
    this.youtubeData = new BehaviorSubject({});
    let socialConfig = require("../../shared/config/socialNetworkConfig.json").socialConfig;
    this.youtubeClient_id = socialConfig.youtubeClientId;
    this.oauth_verifier = this.GetURLParameter("oauth_verifier");
    let linkedinCode = this.getLinkedinURLParameter("code");
    if (this.oauth_verifier) {
      this.selectedNetwork = "twitter";
    } else if (!this.oauth_verifier && linkedinCode) {
      this.selectedNetwork = "linkedin";
    }
    else {
      this.selectedNetwork = "youtube";
    }
    if (this.selectedNetwork === "twitter") {
      this.access_token = this.GetURLParameter("oauth_token");
      this.oauth_verifier = this.GetURLParameter("oauth_verifier");
      let session = {
        access_token: this.GetURLParameter("oauth_token"),
        oauth_verifier: this.GetURLParameter("oauth_verifier")
      }
      if (this.oauth_verifier) {
        this.myNetworkService.twiiterAccountCreate(this.oauth_verifier).subscribe(res => {
          this.router.navigateByUrl("/my-networks");
        }, error => {
          this.openDialog(error.details.messages.userId[0]);
        })
      }
    }
    if (this.selectedNetwork === "youtube") {
      this.access_token = this.GetURLParameter("access_token");
      let session = {
        access_token: this.GetURLParameter("access_token"),
        scope: this.GetURLParameter("scope"),
        token_type: this.GetURLParameter("token_type"),
        expires_in: this.GetURLParameter("expires_in")

      }
      if (this.access_token) {
        this.socialMediaService.createYouTubeAccount(this.youtubeClient_id, session).subscribe(res => {
          this.selectedNetwork = "";

          //  this.youtubeData.next(res);
          this.networkInfor(res)

          this.router.navigateByUrl("/my-networks");

          // this.myNetworkService.myAccounts().subscribe(res => {

          // })
        });
      }
    }
    if (this.selectedNetwork === "linkedin") {

      let state = this.getURLParameter("state");
      this.socialMediaService.getLinkedinAccessToken(linkedinCode, state).subscribe(res => {

      })
      // if (this.access_token) {
      //   this.socialMediaService.createYouTubeAccount(this.youtubeClient_id, session).subscribe(res => {
      //    this.selectedNetwork = "";
      //    this.networkInfor(res)
      //    this.router.navigateByUrl("/my-networks");
      //   });
      // }
    }
    if (this.socialAccountsStore.dirty == true) {
      this.getMyNetworks();
      this.socialAccountsStore.updateNetwroks();
    }
    else {
      if (this.socialAccountsStore.socialAccounts.length <= 0) {
        this.getMyNetworks();
      } else {
        this.socialAccountsDetail$.next(this.socialAccountsStore.searchAccontsByUserName);
      }
    }
  }
  getURLParameter(sParam) {
    var sPageURL = window.location.href;
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  getLinkedinURLParameter(sParam) {
    var sPageURL = window.location.href;
    var sURLVariables = sPageURL.split('?');

    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }
  GetURLParameter(sParam) {
    var sPageURL = window.location.href;
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }

  openDialog(error) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: 'Account exits..',
      description: errors.errors.addNetworkError,
      // inputHeading: 'Feed back ',
      // actionButtonText: 'Disconnect'
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getMyNetworks() {
    this.myNetworkService.myAccounts().subscribe(async (data) => {
      if (this.lastSearch) {
        if (this.lastSearch.nameKeyword != "" || this.lastSearch.platform != null || this.lastSearch.status != null) {
          this.searchAccount(this.lastSearch)
        }
        else {
          this.socialAccountsDetail$.next(this.socialAccountsStore.searchAccontsByUserName)
        }
      }
      else {
        this.socialAccountsDetail$.next(this.socialAccountsStore.searchAccontsByUserName)
      }
    });
  }

  selectedSmAccount(id: string) {
    this.myNetworkService.disconnetAccount(id).subscribe(res => {
      this.getMyNetworks();
    });
  }

  searchAccount(searchFilter: SearchModel) {
    this.lastSearch = searchFilter;
    this.myNetworkService.SearchInMyNetworks(searchFilter);
    this.filterValues();
  }

  filterValues() {
    this.socialAccountsDetail$.next(this.socialAccountsStore.searchAccontsByUserName);
  }

  showSmPlatform() {
    this.isNetworksListShow = !this.isNetworksListShow;
  }

  reRender($event) {
    this.getMyNetworks();
  }

  updateAccountsList(event) {
    this.myNetworkService.myAccounts().subscribe((data) => {
      this.socialAccountsDetail$.next(this.socialAccountsStore.searchAccontsByUserName);
    });
  }

  updateLinkedData(data: any) {
    this.socialMediaService.updateData(data.id, data.linkedData).subscribe(res => {
      this.socialAccountsDetail$.next(this.socialAccountsStore.socialAccounts);
    })
  }

  deleteAccount(accountId: string) {
    this.activateLoader(true);
    this.socialMediaService.deleteSocialMediaAccount(accountId).subscribe(res => {
      this.socialAccountsDetail$.next(this.socialAccountsStore.socialAccounts);
      this.activateLoader(false);
    })
  }

  clearSearch(clearSearch: SearchModel) {
    this.lastSearch = new SearchModel();
  }

  activateLoader(event) {
    this.activeLoader = event;
  }

  networkInfor(network: object) {


    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = network;
    dialogConfig.width = '50%';
    dialogConfig.height = "auto";
    dialogConfig.disableClose = true;
    // {
    // const dialogRef = this
    //   .dialog
    //   .open(GlobalDialogComponent, dialogConfig);

    // const dialogBoxConfiguration = new MatDialogConfig();
    // dialogBoxConfiguration.data=network;
    // dialogBoxConfiguration.width='50%';
    // dialogBoxConfiguration.height="auto";
    // dialogBoxConfiguration.disableClose=true;
    // {
    //   data: dialogBoxConfiguration,
    //   width: '50%',
    //   height: 'auto',
    //   disableClose: true
    // }

    const dialogBoxReferance = this.dialog.open(SocialMediaDetailsSelecterComponent, dialogConfig);
    console.log("Net is", network);

    dialogBoxReferance.componentInstance.network = network;
    dialogBoxReferance.componentInstance.onUpdataPages.subscribe(res => {
      this.updateLinkedData(res);
      dialogBoxReferance.componentInstance.dialogRef.close();
    })
    dialogBoxReferance.componentInstance.onDeleteAccount.subscribe(accountId => {
      this.deleteAccount(accountId);
    })
  }
}