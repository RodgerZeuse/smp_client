import { Component, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { UserProfile } from 'src/app/store/user-profile';
@Component({
  selector: 'social-media-connector',
  templateUrl: './social-media-connector.component.html',
  styleUrls: ['./social-media-connector.component.css']
})
export class SocialMediaConnectorComponent {
  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() networkInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() onActiveLoader: EventEmitter<boolean> = new EventEmitter();
  constructor(private profileStore: UserProfile) { }

  updateAccountsList(event) {
    this.isUpdateList.emit(true);
  }

  showLoader() {
    this.onActiveLoader.emit(true);
  }

  networkInfor(network: any) {
    this.onActiveLoader.emit(false);
    this.networkInfo.emit(network);
  }
}
