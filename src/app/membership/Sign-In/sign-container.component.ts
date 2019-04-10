import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { LoginData } from "./user/logindata";
import { AlertModel } from "../../shared/model/alert.model";
import { userLoginService } from "../service/User-Login.service";
import { UserProfile } from "../../store/user-profile";
import { BehaviorSubject } from "rxjs";
import { Router } from "../../../../node_modules/@angular/router";
import { MyNetworkService } from "../service/my-network.service";
import { CampaignService } from "../../campaign/shared/service/campaign.service";
let errors = require("./message.json");

@Component({
  selector: "app-sign-container",
  templateUrl: "./sign-container.component.html",
  styleUrls: ["./sign-container.component.css"]
})
export class SignContainerComponent {
  alertModel: AlertModel = new AlertModel();
  alertModel$ = new BehaviorSubject(this.alertModel);

  constructor(
    private ref: ChangeDetectorRef,
    private socialMediaAccount: MyNetworkService,
    public userLoginService: userLoginService,
    public userProfile: UserProfile,
    public router: Router,
    private campaignService: CampaignService
  ) {}

  onLogin(login: LoginData) {
    this.alertModel.isValidate = true;
    this.alertModel$.next(this.alertModel);
    this.userProfile.loaderStart();
    this.userLoginService.authentication(login).subscribe(
      async result => {
        // this.userLoginService.getCurrentUserProfile().subscribe();
        // this.campaignService.getCamapign().subscribe(res => { });
        await this.userProfile.loaderEnd();
        // this.socialMediaAccount.myAccounts().subscribe((data) => { });
        this.userProfile.isLogin = true;
        // this.companyService.getUserAccounts().subscribe(data => { });
        this.router.navigateByUrl("/");
      },
      err => {
        this.userProfile.loaderEnd();
        this.alertModel.messages = [errors.errors.login];
        this.alertModel.isValidate = false;
        this.alertModel$.next(this.alertModel);
      }
    );
  }
}
