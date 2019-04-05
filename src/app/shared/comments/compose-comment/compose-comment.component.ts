import { Component, OnInit, Input, Output ,EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Campaign } from '../../../shared/sdk';
import { CampaignService } from './../../../campaign/shared/service/campaign.service';

@Component({
  selector: 'compose-comment',
  templateUrl: './compose-comment.component.html',
  styleUrls: ['./compose-comment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeCommentComponent implements OnInit {
@Input() campaign$:Observable<any>
@Output() newComment:EventEmitter<string> = new EventEmitter<string>();
comment:string;  
campaignId:string;
@Output() isInvitaionSend:EventEmitter<boolean> = new EventEmitter<boolean>();
newCampaignCommetns = new BehaviorSubject(this.campaign$)
constructor(public campaignService:CampaignService) { }

  ngOnInit() {
  }
  sendComment(comment){
    
    console.log("new comment",comment)
    if(comment){
      this.newComment.emit(comment)
      this.comment = "";
    }
  }
  sendInvitation = () =>{
    this.isInvitaionSend.emit(true);
  }
}
