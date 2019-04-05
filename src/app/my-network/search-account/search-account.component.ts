import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MyNetworksContainerComponent } from '../../my-network/my-networks-container/my-networks-container.component';
import { SearchModel } from '../../shared/model/searchModel';
import { AllPlatforms } from '../../shared/model/platforms';
import { MyNetworkStatus } from '../../shared/model/myNetworkStatus';
import { UserProfile } from '../../store/user-profile';

@Component({
  selector: 'search-account',
  templateUrl: './search-account.component.html',
  styleUrls: ['./search-account.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchAccountComponent implements OnInit {
  @Output() searchAccount: EventEmitter<SearchModel> = new EventEmitter<SearchModel>();
  @Output() clearSearch: EventEmitter<SearchModel> = new EventEmitter<SearchModel>();

  clearPlatforms: string;
  accountsUserName: string = '';
  platform: AllPlatforms;
  checked: boolean = false;
  Status: string;
  searchModel: SearchModel;
  status: MyNetworkStatus;
  clearStatus: string;

  constructor(private userProfile:UserProfile) {
    this.platform = new AllPlatforms();
    this.status = new MyNetworkStatus();
    this.searchModel = new SearchModel();
  }

  changeStatus() {
    this.checked = !this.checked;
    if (this.checked == true) {
      this.Status = "Connected"
    }
    else {
      this.Status = "Disconnect";
    }
  }
  connectSelected() {
    this.status.connected = !this.status.connected;
    this.status.any = false;
  }
  disconnectSelected() {
    this.status.disconnected = !this.status.disconnected;
    this.status.any = false;
  }
  instagramSelected() {
    this.platform.instagram = !this.platform.instagram;
  }

  facebookSelected() {
    this.platform.facebook = !this.platform.facebook;
  }

  youtubeSelected() {
    this.platform.youtube = !this.platform.youtube;
  }


  search() {
    if (this.status.connected == false && this.status.disconnected == false) {
      this.status.any = true;
    }
    this.searchModel.nameKeyword = this.accountsUserName;
    this.searchModel.platform = this.platform;
    this.searchModel.status = this.status;
    this.searchAccount.emit(this.searchModel);
  }

  clearSearches() {
    this.clearPlatforms = "";
    this.accountsUserName = '';
    this.platform.instagram = false;
    this.platform.facebook = false;
    this.platform.youtube = false;
    this.clearStatus = "";
    this.status.any = false;
    this.status.connected = false;
    this.status.disconnected = false;
    this.clearSearch.emit(this.searchModel);

  }

  ngOnInit() {
    this.accountsUserName = '';
    this.platform.instagram = false;
    this.platform.facebook = false;
    this.platform.youtube = false;
    this.status.any = false;
    this.status.connected = false;
    this.status.disconnected = false;
  }

}
