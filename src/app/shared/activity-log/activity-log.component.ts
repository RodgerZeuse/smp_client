import { Component, OnInit } from '@angular/core';
import { SharedService } from '../service/shared-service';
import { Router } from '@angular/router';
@Component({
  selector: 'activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {
data:Array<any>;
imgUrl:string;
  constructor(public sharedService:SharedService,public router:Router) { }

  ngOnInit() {
   this.imgUrl =  require("./../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
    this.sharedService.getActivityStream().subscribe(res =>{
  
      this.data = res;
      console.log("activty stream =", res);
    })
  }
  gotoCampaign(id){
    this.router.navigate(['/campaign/edit-campaign'], { queryParams: { id: id } })
  }
}
