import { Component, OnInit } from '@angular/core';
import { SocialAccountsStore } from './../../store/social-accounts-store';
import { UserProfile } from './../../store/user-profile';
import { MyNetworkService } from 'src/app/membership/service/my-network.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'attached-accounts-details-container',
  templateUrl: './attached-accounts-details-container.component.html',
  styleUrls: ['./attached-accounts-details-container.component.css']
})
export class AttachedAccountsDetailsContainerComponent implements OnInit {
  socialAccountsDetail: Array<any> = []
  socialAccountsDetail$ = new BehaviorSubject(this.socialAccountsDetail);

  constructor(private socialAccountsStore: SocialAccountsStore,
    private myNetworkService: MyNetworkService,
    public profileStore: UserProfile) { }

  ngOnInit() {
    this.getUserAccounts();
  }

  getUserAccounts() {
    if (this.socialAccountsStore.allSocialAccounts.length > 0) {
      this.socialAccountsDetail$.next(this.socialAccountsStore.allSocialAccounts);
    }
    else {
      this.myNetworkService.myAccounts().subscribe((data) => {
        this.socialAccountsDetail$.next(this.socialAccountsStore.allSocialAccounts);
      });
    }
  }

}
