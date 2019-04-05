import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MyNetworkService } from '../../../membership/service/my-network.service';
import { UserProfile } from '../../../store/user-profile';
import { SocialMediaService } from '../service/social-media.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from '../../../shared/global-dialog/global-dialog.component';
declare var PDK: any;
declare var window: any;
let errors = require('../../message.json')
@Component({
  selector: 'pinterest-connector',
  templateUrl: './pinterest-connector.component.html',
  styleUrls: ['./pinterest-connector.component.css']
})
export class PinterestConnectorComponent implements OnInit {
  icons: object = {};
  access_token: string;
  socialConfig = require("./../../../shared/config/socialNetworkConfig.json").socialConfig;

  @Output() onLoaderEnable: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() networkInfo: EventEmitter<object> = new EventEmitter<object>();
  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog, public socialMediaService: SocialMediaService,
    public userProfile: UserProfile, public socialAccountService: MyNetworkService) {
    window.pAsyncInit = () => {
      PDK.init({
        appId: this.socialConfig.pinterestAppId, // Change this
        cookie: true
      });
    };
    let self = this;
    (function (d, s, id) {
      var js, pjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = self.socialConfig.pinterestSrc;
      pjs.parentNode.insertBefore(js, pjs);
    }(document, 'script', 'pinterest-jssdk'));
  }

  ngOnInit() {
    this.icons = require("./../../../shared/config/icons.json").icons;
  }

  pinterestOauth() {
    this.onLoaderEnable.emit(true);
    let self = this;
    PDK.login({ scope: 'read_relationships,read_public,write_public' }, function (aouth) {
      if (!aouth || aouth.error) {
        alert('Error occurred authentication');
      } else {
        PDK.request('/v1/me/?access_token=' + PDK.getSession().accessToken, { fields: "first_name,id,last_name,url,bio,account_type,counts,created_at,image,username" }, function (profile) {
          if (!profile || profile.error) {
            alert('Error occurred gettting profile');
          } else {
            PDK.request('/v1/me/boards/?access_token="' + PDK.getSession().accessToken + '"', function (boards) {
              self.socialMediaService.createPinterestAccount(aouth, profile, boards).subscribe((account: any) => {

                self.socialMediaService.getPagesAndGroups(account.id).subscribe(responce => {
                  let networkPages = JSON.parse(responce['_body']);
                  console.log("Account is", responce);
                  self.networkInfo.emit(networkPages);
                  self.isUpdateList.emit(true);
                })
              }, error => {
                this.openDialog(error.details.messages.userId[0]);
              })
              PDK.logout();
            })


          }
        });
      }
      //get board info
      // https://api.pinterest.com/v1/me/?access_token=&fields=first_name%2Cid%2Clast_name%2Caccount_type%2Cimage%2Cusername%2Ccounts%2Cbio


      //end get board info
    });

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
