import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit
} from "@angular/core";
import { SocialMediaService } from "../service/social-media.service";
import { MyNetworkService } from "../../../membership/service/my-network.service";
import { UserProfile } from "../../../store/user-profile";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { GlobalDialogComponent } from "../../../shared/global-dialog/global-dialog.component";

declare var FB: any;
let errors = require("../../message.json");

@Component({
  selector: "facebook-connector",
  templateUrl: "./facebook-connector.component.html",
  styleUrls: ["./facebook-connector.component.css"]
})
export class FacebookConnectorComponent {
  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() networkInfo: EventEmitter<object> = new EventEmitter<object>();
  @Output() onLoaderEnable: EventEmitter<boolean> = new EventEmitter<boolean>();

  icons: object = {};
  constructor(
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    public socialMediaService: SocialMediaService,
    public userProfile: UserProfile,
    public socialAccountService: MyNetworkService
  ) {
    this.icons = require("./../../../shared/config/icons.json").icons;
  }

  facebookAuth() {
    this.onLoaderEnable.emit(true);
    let self = this;
    FB.login(
      async response => {
        if (response.authResponse) {
          await FB.api(
            "/me",
            { fields: "id,name,email,picture" },
            async resp => {
              try {
                self.socialMediaService
                  .createFacebookAccount(
                    resp.id,
                    resp.name,
                    response,
                    resp.picture.data.url
                  )
                  .subscribe(
                    (account: any) => {
                      self.socialMediaService
                        .getPagesAndGroups(account.id)
                        .subscribe(responce => {
                          // let network = JSON.parse(responce['_body']);
                          console.log(responce);
                          let network = responce;
                          self.networkInfo.emit(network);
                          self.isUpdateList.emit(true);
                        });
                    },
                    error => {
                      this.openDialog(error.details.messages.userId[0]);
                    }
                  );
              } catch (error) {
                console.log(error);
              }
            }
          );
        } else {
        }
      },
      {
        scope:
          "publish_pages,manage_pages,user_likes,user_status,email,pages_show_list"
      }
    );
  }

  openDialog(error) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      heading: "Account exits..",
      description: errors.errors.addNetworkError
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {});
  }
}
