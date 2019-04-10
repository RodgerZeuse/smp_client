import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/switchMap";
import { ResetPassword } from "../Model/changepassword";
import { UserProfile } from "../../store/user-profile";
import { LoginData } from "../Sign-In/user/logindata";
import { LoopBackAuth, RegisterUserApi } from "../../shared/sdk/services";
import { AccessToken, SDKToken } from "../../shared/sdk/models";
import { RegisterUser } from "../../shared/sdk";

@Injectable({
  providedIn: "root"
})
export class userLoginService {
  token: AccessToken;
  constructor(
    public http: HttpClient,
    public auth: LoopBackAuth,
    public registerUserApi: RegisterUserApi,
    private profileStore: UserProfile
  ) {}

  onChange(password: ResetPassword): Observable<void> {
    return this.registerUserApi
      .changePassword(password.currentPassword, password.newPassword)
      .map(data => {
        return data;
      });
  }

  givePassword(email) {
    return this.registerUserApi.resetPassword({ email: email }).map(data => {
      return data;
    });
  }

  reset(password: ResetPassword): Observable<void> {
    return this.registerUserApi
      .setPassword(password.newPassword)
      .map((data: any) => {
        return data;
      });
  }

  authentication(login: LoginData) {
    let credentials = {
      email: login.email,
      password: login.password
    };
    return this.registerUserApi
      .login(credentials)
      .switchMap((data: AccessToken) => {
        this.token = data;
        this.auth.setToken(<SDKToken>data);
        this.auth.setRememberMe(true);
        this.auth.save();
        this.profileStore.saveAccessToken_userID(data.id, data.userId);
        // return this.registerUserApi.findById(this.profileStore.userId);
        return this.registerUserApi
          .findById(this.profileStore.userId)
          .map((data: RegisterUser) => {
            this.profileStore.saveEmail_accounType(data.email);
            this.profileStore.saveUserDateInLocalStorage(data, this.token);
            return;
          });
      })
      .switchMap((role: any) => {
        if (role) {
          var currentUser: RegisterUser = <RegisterUser>(
            this.auth.getCurrentUserData()
          );
          return Observable.of(currentUser);
        }
        return Observable.of("");
      });
  }
}
