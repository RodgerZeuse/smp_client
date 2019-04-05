import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SocialMediaService } from '../service/social-media.service';
import { MyNetworkService } from '../../../membership/service/my-network.service';
import { UserProfile } from '../../../store/user-profile';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from '../../../shared/global-dialog/global-dialog.component';
declare var FB: any;
declare var window: any;
let errors = require('../../message.json')
@Component({
  selector: 'instagram-connector',
  templateUrl: './instagram-connector.component.html',
  styleUrls: ['./instagram-connector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstagramConnectorComponent implements OnInit {
  access_token: string;
  icons: object = {};
  @Output() networkInfo: EventEmitter<object> = new EventEmitter<object>();
  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onLoaderEnable: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog, public socialMediaService: SocialMediaService, private userProfile: UserProfile, public socialAccountService: MyNetworkService) { }

  ngOnInit() {
    this.icons = require("./../../../shared/config/icons.json").icons;
  }
  instagramOauth() {
    this.onLoaderEnable.emit(true);
    var self = this;
    let profile;
    let accounts;
    let ids = [];
    FB
      .login(function (response) {

        if (response.authResponse) {

          FB.api('/me', { fields: 'id,name,email,picture' }, resp => {

            profile = resp
            FB.api('/me/accounts', resp => {

              accounts = resp;
              for (let i = 0; i < accounts.data.length; i++) {

                ids.push(accounts.data[i].id);
              }

              if (ids.length > 0) {
                let counter = 0;
                for (let j = 0; j < ids.length; j++) {
                  FB.api(ids[j] + "?fields=instagram_business_account", resp => {

                    if (resp.instagram_business_account) {
                      counter++;
                      if (counter === 1) {
                        self.socialMediaService.createInstagramAccount(profile.id, profile.name, response, profile.picture.data.url).subscribe((account: any) => {
                          self.socialMediaService.getPagesAndGroups(account.id).subscribe(responce => {
                            console.log("Instagram Account is", responce);
                            let networkPages = JSON.parse(responce['_body']);
                            self.networkInfo.emit(networkPages);
                            self.isUpdateList.emit(true);
                          })
                          self.socialAccountService.myAccounts().subscribe(res => {

                          })
                        }, error => {
                          this.openDialog(error.details.messages.userId[0]);
                        });
                      }

                    }
                  });
                }

              }
            });
          })


        } else {
        }
      }, { scope: ['instagram_basic', 'instagram_manage_insights', 'manage_pages', 'read_audience_network_insights'] });

  }
  openDialog(error) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {

      heading: 'Account exits..',
      description: errors.errors.addNetworkError,
      // inputHeading: 'Feed back ',
      // actionButtonText: 'Disconnect'
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
