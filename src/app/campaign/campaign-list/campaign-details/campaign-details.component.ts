import { Component, Input } from '@angular/core';
import { Campaign } from '../../../shared/sdk/models';

@Component({
  selector: 'campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent{
  icons: object;
  imagePath:string;
  @Input() campaign: Campaign;
  
  constructor(){
    this.icons = require('./../../../shared/config/icons.json').icons;
    this.imagePath = require('./../../../shared/config/urls.json').IMAGE_DOWNLOAD_END_POINT_URL;
  }
  
}