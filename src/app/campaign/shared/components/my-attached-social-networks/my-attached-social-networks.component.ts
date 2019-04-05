import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, HostListener, OnChanges } from '@angular/core';
// import { UserProfile } from "../../store/user-profile";
import { Observable, Subject, empty, BehaviorSubject } from 'rxjs';
import { SocialMediaAccount } from "../../../../shared/sdk/models/SocialMediaAccount";
import { SocialAccountForCreate } from './model/social-account-for-create.model';
// import { MatSnackBar } from '@angular/material';
// import { UserProfile } from "../../store/user-profile";
// import { } from "./../../../shared/config/";
import * as _ from "lodash";
import { access } from 'fs';
import { concat } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'my-attached-social-networks',
  templateUrl: './my-attached-social-networks.component.html',
  styleUrls: ['./my-attached-social-networks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyAttachedSocialNetworksComponent implements OnInit {
  icons: object;
  accountIndex: number;
  @Input() myAttachedSocialAccounts$: Observable<Array<SocialMediaAccount>>;
  @Output() onSelectSocialAccountArtifact: EventEmitter<any> = new EventEmitter<any>();
  // @Output() onNewAccountPageSelection: EventEmitter<SocialAccountForCreate> = new EventEmitter<SocialAccountForCreate>();
  @Input() shouldSelectedAccountReset: boolean;
  // @Input() inputSelectedSocialAccountsArrayWithPages$: Observable<Array<SocialAccountForCreate>>;
  @Output() onRemoveAccountsPage: EventEmitter<Array<SocialAccountForCreate>> = new EventEmitter<Array<SocialAccountForCreate>>();
  @Input() selectedSocialAccountsArtifactsArray$: Observable<Array<SocialAccountForCreate>>;
  socialAcountObj: SocialAccountForCreate;
  isAttachedAccountExist: boolean;
  @Output() resetSeletedAccount: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('window:click', ['$event'])
  onClickEvent(e) {
    // console.log("documnet click capture", e)
    if (e.target.id != "selectAccount") {
      this.accountIndex = -1;
    }
  }
  constructor(public snackBar: MatSnackBar, public router: Router) {
    this.accountIndex = -1;
    // this.isAttachedAccountExist = false;
  }
  ngOnInit() {
    this.icons = require('./../../../../shared/config/icons.json').icons;
  }
 
  // verifyNetworkConnectedStatus() {
  //   let array = []
  //   // if (this.myAttachedSocialAccounts$.length >= 1) {
  //     this.myAttachedSocialAccounts$.subscribe(res => {
  //       let accountExist = _.map(res, function (a) {
  //         if (a.status == 'connected') {
  //           array.push(a.status);
  //         }
  //       })
  //     })
  //     return Observable.of(array)
  //   }

  // }



  openPageMenu(accountIndex) {

    this.accountIndex = accountIndex;
  }
  selectSocialAccountArtifact(socialAccount, page) {

    this.socialAcountObj = {
      socialAccountObj: socialAccount,
      pageObj: page
    }
    this.onSelectSocialAccountArtifact.emit(this.socialAcountObj);


  }


  onRemoveAccountsArtifact(accountObj) {
    this.onRemoveAccountsPage.emit(accountObj);

  }
  checkAccountPageExist(accountId: string) {
    return _.filter(this.selectedSocialAccountsArtifactsArray$._value,
      {
        socialAccountObj: { id: accountId }
      }
    );
  }
  gotoAddAccountList() {
    this.router.navigateByUrl("/my-networks")
  }
}
