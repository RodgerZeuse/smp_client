import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../campaign/shared/service/campaign.service';
import { Campaign } from '../../shared/sdk';
import { PostViewModel } from '../../shared/model/post-view.model';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'ng-socket-io';
@Component({
  selector: 'campaign-feedback',
  templateUrl: './campaign-feedback.component.html',
  styleUrls: ['./campaign-feedback.component.css']
})
export class CampaignFeedbackComponent implements OnInit {
  campaignId:string;
  posts:Array<PostViewModel> = [];
  campaignPost = new BehaviorSubject(this.posts);
  commentsType:string;
  campaign$ = new BehaviorSubject(Campaign);
  constructor(public socket: Socket,public activeroute:ActivatedRoute,public campaignService:CampaignService) { }

  ngOnInit() {
    this.commentsType = "campaign";
    this.campaignId = this.activeroute.snapshot.params['id'];
    if(this.campaignId){
      this.getComments();
      this.getMessage();
    }
   
  }

  sendMessage = () => {
    console.log("camapign id is",this.campaignId);
    this.socket.emit("message", this.campaignId);
  }

  getMessage = () => {
    this.socket.on("message", (data) => {
      this.campaign$.next(data.newCampaign);
      this.posts = data.newCampaign.posts;
      this.campaignPost.next(this.posts);
      console.log("get message data from socket io", data)

    });
  }
  getComments =() =>{
    this.campaignService.getCampaignForExternalFeedBack(this.campaignId).subscribe((res: any) => {
      console.log("get campaign by id", res);
      this.campaign$.next(res);
      this.posts = res.posts;
      this.campaignPost.next(this.posts);
    })
  }

  newComment = ($event) => {
    this.campaignService.sendComment(this.campaignId, $event).subscribe(res => {
      // this.getComments();
      this.sendMessage();
    })

  }
  
  commentReply = ($event) => {
    this.campaignService.replyComment(this.campaignId, $event.msg, $event.p_id).subscribe(res => {
      this.sendMessage();
    })
  }
}
