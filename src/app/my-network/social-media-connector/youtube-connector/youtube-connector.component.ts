import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SocialMediaService } from '../service/social-media.service';
import { MyNetworkService } from '../../../membership/service/my-network.service';

@Component({
  selector: 'youtube-connector',
  templateUrl: './youtube-connector.component.html',
  styleUrls: ['./youtube-connector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubeConnectorComponent implements OnInit {
  icons: object = {};
  userId: string;
  socialConfig: any;
  access_token: string;

  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onLoaderEnable: EventEmitter<boolean> = new EventEmitter<boolean>();

  client_id: string = "";
  constructor(public socialMediaService: SocialMediaService, public socialAccountService: MyNetworkService) {
  }

  ngOnInit() {
    this.icons = require("./../../../shared/config/icons.json").icons;
    this.socialConfig = require("./../../../shared/config/socialNetworkConfig.json").socialConfig;
    this.client_id = this.socialConfig.youtubeClientId
  }
  youtubeOauth() {
    this.onLoaderEnable.emit(true);
    if (localStorage["userProfile"]) {
      let profile = JSON.parse(localStorage["userProfile"]);
      this.userId = profile.userId;
      this.access_token = profile.acessToken;
    }
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    // console.log("response= " + response.authResponse);
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.

    console.log("youtube access token", this.access_token);
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
    var params = {
      'client_id': this.client_id,
      'redirect_uri': 'http://localhost:4200/my-networks',
      'response_type': 'token',
      'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
      'include_granted_scopes': 'true',
      'state': 'pass-through value'
    };

    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  }
}
