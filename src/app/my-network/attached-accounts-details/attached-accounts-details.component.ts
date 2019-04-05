import { Component, Input, OnInit } from '@angular/core';
import { SocialMediaAccount } from 'src/app/shared/sdk';
import { Observable } from 'rxjs';

@Component({
  selector: 'attached-accounts-details',
  templateUrl: './attached-accounts-details.component.html',
  styleUrls: ['./attached-accounts-details.component.scss']
})
export class AttachedAccountsDetailsComponent implements OnInit {
  @Input() socialAccountsDetail$: Observable<Array<SocialMediaAccount>>;
  
  icons: any;
  ngOnInit() {
      this.icons = require('./../../shared/config/icons.json').icons;
  }
}
