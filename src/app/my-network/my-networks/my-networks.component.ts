import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, OnChanges, ChangeDetectorRef, OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { SocialMediaAccount } from '../../shared/sdk';
import { UserProfile } from './../../store/user-profile'
@Component({
  selector: 'my-networks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-networks.component.html',
  styleUrls: ['./my-networks.component.css'],

})

export class MyNetworkComponent implements OnInit {
  icons: object = {};
  @Input() socialAccountsDetail$: Observable<Array<SocialMediaAccount>>;
  @Output() accountId: EventEmitter<string> = new EventEmitter<string>();
  @Output() isRerender: EventEmitter<boolean> = new EventEmitter<boolean>();

  displayedColumns: string[]
  constructor(public profileStore: UserProfile) {
  }

  ngOnInit() {
    this.icons = require("./../../shared/config/icons.json").icons;
    // if(this.profileStore.disconnectNetwork){
    this.displayedColumns = ['accountType', 'accountPosts', 'userName', 'status', 'remove'];
    // }else
    // {
    // this.displayedColumns = ['accountType', 'accountPosts', 'userName', 'status'];
    // }
  }

  selectedId(event) {
    this.accountId.emit(event);
  }

  reRender($event) {
    this.isRerender.emit($event)
  }

  yes(id) {
    console.log(id);
  }
  
}