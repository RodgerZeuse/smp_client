import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dami-comment',
  templateUrl: './dami-comment.component.html',
  styleUrls: ['./dami-comment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DamiCommentComponent implements OnInit {
  @Input() comment:Observable<any>;
  @Output() commentReply:EventEmitter<Object> = new EventEmitter<Object>();
  @Output() commentId:EventEmitter<string> = new EventEmitter<string>();
  newCampaignCommetns= new BehaviorSubject(this.comment);
replyComment:string; 
imagePath:string;
currentUserId:string;
config:any;
  constructor() { }

  ngOnInit() {
    if(localStorage["userProfile"]){
      let profile = JSON.parse(localStorage["userProfile"]);
      this.currentUserId = profile.userId;
    }
    this.config = require('./../../../../shared/config/urls.json');
    this.imagePath= this.config.IMAGE_DOWNLOAD_END_POINT_URL;
  }
  showChildMsg(id){
    this.commentId.emit(id);
    // for(let i=0;i < this.newCampaignCommetns.value.campaignComments.length;i++){
      
    //    if(this.newCampaignCommetns.value.campaignComments[i].id == id){
    //     this.newCampaignCommetns.value.campaignComments[i].isChildrenShow = !this.newCampaignCommetns.value.campaignComments[i].isChildrenShow; 
        
    //    }
    //  }

  }
  sendReply(id,reply){
    let obj ={
      "p_id":id,
      "msg":reply
    }
    this.commentReply.emit(obj);
    this.replyComment = "";
  }
}
