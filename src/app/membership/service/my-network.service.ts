import { Injectable } from '@angular/core';
import { SocialMediaAccountApi, RegisterUserApi } from '../../shared/sdk/services/';
import { UserProfile } from '../../store/user-profile';
import { SocialAccountsStore } from '../../store/social-accounts-store';
import 'rxjs/add/operator/switchMap';
import { SearchModel } from '../../shared/model/searchModel';
import { SocialAccountForCreate } from '../../campaign/shared/components/my-attached-social-networks/model/social-account-for-create.model';

@Injectable({
  providedIn: 'root'
})
export class MyNetworkService {

  constructor(private socialMediaAccount: SocialMediaAccountApi,
    private userStore: UserProfile,
    private socialAccountsApi: SocialMediaAccountApi,
    public registerApi: RegisterUserApi,
    public socialAccountsStore: SocialAccountsStore) { }

  myAccounts() {
    // return this.registerApi.findById(this.userStore.userId, { include: { "socialAccounts": "posts" } }).map((response: any) => {
    //   //  this.socialMediaAccount.getPosts(response[0].id)
    //   this.socialAccountsStore.saveSocialNetwork(response.socialAccounts);
    //   return response;
    // });
    return this.socialAccountsApi.find({ include: "posts" }).map(accounts => {
      console.log("Resp is ", accounts);

      this.socialAccountsStore.saveSocialNetwork(accounts);
      return accounts;
    })
  }

  twitterOauth() {
    return this.socialMediaAccount.twitterConnect().map(res => {
      return res;
    })
  }

  twiiterAccountCreate(oauth_verifier) {
    let ac = {
      "oauth_verifier": oauth_verifier
    }
    return this.socialMediaAccount.twitterCallBack(oauth_verifier).map(res => {
      return res;
    })
  }

  disconnetAccount(id) {
    return this.socialMediaAccount.findById(id).switchMap(data => {
      let item = data;
      delete item["id"];
      item["status"] = "disconnect";
      return this.socialMediaAccount.updateAttributes(id, item).map(response => {

        return response;
      })
    })
  }

  SearchInMyNetworks(searchFilter: SearchModel) {
    this.socialAccountsStore.searchFilter(searchFilter);
  }


}
