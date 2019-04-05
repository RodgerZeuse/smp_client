import { Injectable } from '@angular/core';
import { UserProfile } from "./../../../store/user-profile";
import { MatSnackBar } from '@angular/material';
import { SocialAccountForCreate } from '../components/my-attached-social-networks/model/social-account-for-create.model';
@Injectable({
  providedIn: 'root'
})
export class CampaignSocialAccountsService {
  constructor(
    public profileStore: UserProfile, public snackBar: MatSnackBar) {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onSelectSocialArtifact(selectedSocialArtifact, selectedSocialAccountsArtifactsArray) {
    let pageFound = false;
    let ifMakeObj = false
    if (selectedSocialAccountsArtifactsArray.length != 0) {
      selectedSocialAccountsArtifactsArray.forEach(accountAndPages => {
        if (accountAndPages.pageObj.id == selectedSocialArtifact.pageObj.id && accountAndPages.socialAccountObj.id == selectedSocialArtifact.socialAccountObj.id) {
          pageFound = true;
        }
      })
      if (!pageFound) {
        return true;
      }
      else {
        this.openSnackBar('Already selected', 'Close');
        return false;
      }
    } else {
      return true;
    }
  }

  removeSelectedSocialAccounts(selectedSocialArtifact, selectedSocialAccountsArtifactsArray:Array<SocialAccountForCreate>) {
    let loopLength = selectedSocialAccountsArtifactsArray.length;
    for (let i = 0; i < loopLength; i++) {
      let findIndex = selectedSocialAccountsArtifactsArray.findIndex(x =>
        x.socialAccountObj.id == selectedSocialArtifact.socialAccountObj.id &&
        x.pageObj.id == selectedSocialArtifact.pageObj.id
      );

      // this.campaignViewModel.posts.forEach((post, index) => {
      if (findIndex > -1) {
        selectedSocialAccountsArtifactsArray.splice(findIndex, 1);
        // this.postsArrayToShow$.next(this.campaignViewModel.posts);
      }
    }
  return selectedSocialAccountsArtifactsArray;
  
    //   let indexesToDeletePosts=[];
  //   selectedSocialAccountsArtifactsArray.forEach((element, index) => {
  //     if (element.socialAccountObj.id == selectedSocialArtifact.socialAccountObj.id && element.pageObj.id == selectedSocialArtifact.pageObj.id) {
  //       // selectedSocialAccountsArtifactsArray.splice(index, 1)
  //       indexesToDeletePosts.push(index);
  //     }
    
  //   })
  //   indexesToDeletePosts.forEach(index=>{
  //     selectedSocialAccountsArtifactsArray.splice(index, 1);
  //   })

  }

}
