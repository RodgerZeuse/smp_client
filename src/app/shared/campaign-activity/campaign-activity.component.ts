import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../service/shared-service';
import { debug } from 'util';
@Component({
  selector: 'campaign-activity',
  templateUrl: './campaign-activity.component.html',
  styleUrls: ['./campaign-activity.component.css']
})
export class CampaignActivityComponent implements OnInit {
  @Input() campaignId:string;
  data:Array<any>;
  imgUrl:string;
    constructor(public sharedService:SharedService) { }
  
    ngOnInit() {
     this.imgUrl =  require("./../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
      this.sharedService.getCampaignActivityStream(this.campaignId).subscribe(res =>{
        this.data = res;
        // console.log("activty stream =", res);
      })
    }

}
