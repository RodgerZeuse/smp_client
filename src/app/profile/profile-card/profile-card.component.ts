import { Component, OnInit, HostListener } from '@angular/core';
import { UserProfile } from '../../store/user-profile';
import { SocialAccountsStore } from '../../store/social-accounts-store';
import { Router } from '@angular/router';
import { CampaignsStore } from '../../store/campaigns-store';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  constructor(private profileService: ProfileService,
    private userProfile: UserProfile,
    private router: Router,
    public socialAccountsStore: SocialAccountsStore,
    private campaignStore: CampaignsStore) { }

  logout() {
    this.profileService.logoutUser().subscribe(data => {
      this.userProfile.isLogin = false;
      localStorage.removeItem('userProfile');
      this.userProfile.reset();
      this.campaignStore.reset();
      this.socialAccountsStore.reset();
      this.router.navigateByUrl('membership');
    })


  }
  ngOnInit() {
    if (this.userProfile.isLogin) {

    }
    else {
      this.router.navigateByUrl("/membership")
    }
  }

  gotoProfile() {
    this.router.navigateByUrl("/profile")
  }
}
