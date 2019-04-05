import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import { ResetPassword } from '../Model/changepassword';
import { UserProfile } from '../../store/user-profile';
import { LoginData } from '../Sign-In/user/logindata';
import { LoopBackAuth, RegisterUserApi, SecurityGroupApi, SystemPermissionsApi, CompanyApi } from "../../shared/sdk/services";
import { AccessToken, SDKToken, SystemPermissions, Company } from "../../shared/sdk/models";
import { RegisterUser } from '../../shared/sdk';
import { ManageCompanyStore } from 'src/app/store/manage-company-store';
import { SecurityGroupModel } from 'src/app/manage-company/security-group-model';


@Injectable({
  providedIn: 'root'
})
export class userLoginService {
  token: AccessToken;
  constructor(public http: HttpClient,
    public securityGroupApi: SecurityGroupApi,
    public auth: LoopBackAuth,
    public registerUserApi: RegisterUserApi,
    private profileStore: UserProfile,
    private companyApi: CompanyApi,
    private companyStore: ManageCompanyStore) { }


  onChange(password: ResetPassword): Observable<void> {
    return this.registerUserApi.changePassword(password.currentPassword, password.newPassword).map(data => {
      return data;
    })
  }

  givePassword(email) {
    return this.registerUserApi.resetPassword({ "email": email }).map(data => {
      return data;
    });
  }

  reset(password: ResetPassword): Observable<void> {
    return this.registerUserApi.setPassword(password.newPassword).map((data: any) => {
      return data;
    });
  }

  authentication(login: LoginData) {
    let credentials = {
      "email": login.email,
      "password": login.password
    }
    return this.registerUserApi.login(credentials)
      .switchMap((data: AccessToken) => {
        this.token = data;
        this.auth.setToken(<SDKToken>data);
        this.auth.setRememberMe(true);
        this.auth.save();
        this.profileStore.saveAccessToken_userID(data.id, data.userId);
        // return this.registerUserApi.findById(this.profileStore.userId);
        return this.registerUserApi.findById(this.profileStore.userId).map((data: RegisterUser) => {
          this.profileStore.setCompany(data.myCompany);
          this.profileStore.saveEmail_accounType(data.email, data.account_type);
          this.profileStore.saveUserDateInLocalStorage(data, this.token);
          if (this.profileStore.userAccountType != 'company') {
            this.registerUserApi.getRights().subscribe(res => {
              this.profileStore.setUserRights(res);
            });
          }
          return;
        });
      })
      // .switchMap((appUser: RegisterUser) => {
      //   this.auth.setUser(appUser)
      //   return this.registerUserApi.getTeamMembers(this.auth.getToken().userId)
      // })
      .switchMap((role: any) => {
        if (role) {
          var currentUser: RegisterUser = <RegisterUser>this.auth.getCurrentUserData();
          return Observable.of(currentUser.account_type);
        }
        return Observable.of('');
      });
  }

  // getCurrentUserProfile(): Observable<void> {
  //   return this.registerUserApi.findById(this.profileStore.userId)
  //     .map((data: RegisterUser) => {
  //       this.profileStore.setCompany(data.myCompany);
  //       this.profileStore.saveEmail_accounType(data.email, data.account_type);
  //       this.profileStore.saveUserDateInLocalStorage(data, this.token);
  //       if (this.profileStore.userAccountType != 'company') {
  //         this.registerUserApi.getRights().subscribe(res => {
  //           this.profileStore.setUserRights(res);
  //           // let findIndex = this.profileStore.userRights.findIndex(
  //           //   right => { return right.key === "MANAGE_COMPANY" })
  //           // if (findIndex > -1) {
  //           //   this.companyApi.findById(this.profileStore.company.id, { include: [{ "securityGroups": ["registersUsers", "Rights"] }, "registerUsers"] }).subscribe((res: Company) => {
  //           //     console.log("Company Users are", res);

  //           //     this.profileStore.setCompany(res);
  //           // })
  //           //   }
  //         });
  //       }
  //       return;
  //     });
  // }

  getSecurityGroups(): Observable<Array<SecurityGroupModel>> {
    return this.securityGroupApi.find({ where: { registerUserId: this.profileStore.userId } }).map((securityGroup: Array<SecurityGroupModel>) => {
      this.companyStore.setCompanyGroups(securityGroup);
      return securityGroup;
    })
  }
}
