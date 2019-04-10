import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { SocialMediaAccountApi } from "../../../shared/sdk";
import { SocialAccountsStore } from "./../../../store/social-accounts-store";
import { UserProfile } from "./../../../store/user-profile";

@Injectable()
export class SocialMediaService {
  userId: string;
  access_token: string;
  icons: any;
  constructor(
    public http: Http,
    public socialAccountsStore: SocialAccountsStore,
    public profileStore: UserProfile,
    public socialMediaAccountApi: SocialMediaAccountApi
  ) {
    this.icons = require("./../../../shared/config/icons.json").icons;
  }

  twitterOauth() {
    return this.http
      .get("http://d1c4432b.ngrok.io/api/SocialMediaAccounts/session/connect")
      .map(res => {
        return res;
      });
  }

  createPinterestAccount(session, profile, boards) {
    if (localStorage["userProfile"]) {
      let userProfile = JSON.parse(localStorage["userProfile"]);
      this.userId = userProfile.userId;
      this.access_token = userProfile.acessToken;
    }
    let ac = {
      type: "PI",
      status: "connected",
      userId: profile.data.id,
      userName: profile.data.username
        ? profile.data.username
        : profile.data.first_name,
      session: session,
      registerUserId: this.userId,
      pictureThumbnail: profile.data.image
        ? profile.data.image["60x60"].url
        : this.icons.avatarIcon,
      boards: boards,
      profile: profile
    };
    return this.socialMediaAccountApi.create(ac).map(
      account => {
        console.log("pinterest api response", account);
        return account;
      },
      err => {
        return err.details.messages.userId[0];
      }
    );
  }

  createFacebookAccount(id, name, session, pictureThumbnail) {
    if (localStorage["userProfile"]) {
      let profile = JSON.parse(localStorage["userProfile"]);
      this.userId = profile.userId;
      this.access_token = profile.acessToken;
    }
    // let headers = new Headers();
    // headers.append('Authorization', `Bearer ${this.access_token}`);
    let ac = {
      type: "FB",
      userId: id,
      userName: name,
      session: session.authResponse,
      status: session.status,
      registerUserId: this.userId,
      pictureThumbnail: pictureThumbnail
    };
    return this.socialMediaAccountApi.create(ac).map(
      account => {
        return account;
      },
      err => {
        return err.details.messages.userId[0];
      }
    );
  }

  createInstagramAccount(id, name, session, pictureThumbnail) {
    if (localStorage["userProfile"]) {
      let profile = JSON.parse(localStorage["userProfile"]);
      this.userId = profile.userId;
      this.access_token = profile.acessToken;
    }
    // let headers = new Headers();
    // headers.append('Authorization', `Bearer ${this.access_token}`);
    let ac = {
      type: "IG",
      userId: id,
      userName: name,
      session: session.authResponse,
      status: session.status,
      registerUserId: this.userId,
      pictureThumbnail: pictureThumbnail
    };
    return this.socialMediaAccountApi.create(ac).map(
      account => {
        return account;
      },
      err => {
        return err.details.messages.userId[0];
      }
    );
  }

  createTwitterAccount() {
    if (localStorage["userProfile"]) {
      let profile = JSON.parse(localStorage["userProfile"]);
      this.userId = profile.userId;
      this.access_token = profile.acessToken;
    }
    // let ac = { type: 'YT', userId: clientId,companyId:this.profileStore.company.id, session:session, registerUserId: this.userId,status: "connected"};
    // return this.socialMediaAccountApi.create(ac).map((account) => {
    //     console.log("facebook api response",account);
    //     return account;
    //      })
    //   ._catch(this.HandleError)
  }

  createYouTubeAccount(clientId, session) {
    if (localStorage["userProfile"]) {
      let profile = JSON.parse(localStorage["userProfile"]);
      this.userId = profile.userId;
      this.access_token = profile.acessToken;
    }
    // let headers = new Headers();
    // headers.append('Authorization', `Bearer ${this.access_token}`);
    let ac = {
      type: "YT",
      userId: clientId,
      session: session,
      registerUserId: this.userId,
      status: "connected"
    };
    return this.socialMediaAccountApi
      .create(ac)
      .map(account => {
        return account;
      })
      ._catch(this.HandleError);
  }

  private HandleError(error: Response) {
    let errors = error.json();
    let errorData = errors._body.message;
    return Observable.throw(errorData);
  }

  getLinkedinAccessToken(code, state) {
    let header = new Headers();
    header.append("content-type", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: header });

    return this.http
      .get(
        "https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=" +
          code +
          "&redirect_uri=http://localhost:4200/my-networks&client_id=77g7k13xjls3dk&client_secret=dTez37vyK56uuERH",
        options
      )
      .map(res => {
        return res;
      });
  }
  getPagesAndGroups(id: string) {
    // return this.http
    //   .get(
    //     "http://192.168.1.127:3003/api/SocialMediaAccounts/getSmPages?socialMediaId=" +
    //       id,
    //     {}
    //   )
    //   .map(res => {
    //     return res;
    //   });
    return this.socialMediaAccountApi.getSmPages(id).map(res=> {
      return res;
    })
  }

  updateData(id, data) {
    return this.socialMediaAccountApi.patchAttributes(id, data).map(res => {
      this.socialAccountsStore.updateLinkedAccount(res);
      return res;
    });
  }

  deleteSocialMediaAccount(accountId: string) {
    return this.socialMediaAccountApi.deleteById(accountId).map(res => {
      this.socialAccountsStore.deleteSocialNetwork(accountId);
      return res;
    });
  }
}
