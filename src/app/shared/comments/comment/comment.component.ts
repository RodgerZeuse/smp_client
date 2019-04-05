import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {Campaign} from '../../../shared/sdk';

@Component({selector: 'comment', templateUrl: './comment.component.html', styleUrls: ['./comment.component.css'], changeDetection: ChangeDetectionStrategy.OnPush})
export class CommentComponent implements OnInit {
  @Input()comments : Observable < any >;
  @Output()commentReply : EventEmitter < Object > = new EventEmitter < Object > ();
  newCampaignCommetns = new BehaviorSubject(this.comments);
  replyComment : string;
  constructor() {}

  ngOnInit() {

    if (this.comments) {
      this
        .comments
        .subscribe((comment) => {
          if (comment && comment.campaignComments && comment.campaignComments.length > 0) {
            this.newCampaignCommetns.next(comment);
            // console.log(this.newCampaignCommetns)
            // for (let i = 0; i < comment.campaignComments.length; i++) {
            //   comment.campaignComments[i].children = [];
            //   comment.campaignComments[i].isChildrenShow = false;
            //   if (comment.campaignComments[i].parent) {
            //     for (let j = 0; j < comment.campaignComments.length; j++) {
            //       if (comment.campaignComments[i].parent === comment.campaignComments[j].id) {

            //         comment.campaignComments[j].children.push(comment.campaignComments[i]);
            //         this.newCampaignCommetns.next(comment);

            //       }
            //     }

            //   }
            //   else{
            //     this.newCampaignCommetns.next(comment);
            //   }
            // }
          }

        })
    }

  }
  showChildMsg(id) {
    for (let i = 0; i < this.newCampaignCommetns.value.campaignComments.length; i++) {

      if (this.newCampaignCommetns.value.campaignComments[i].id == id) {
        this.newCampaignCommetns.value.campaignComments[i].isChildrenShow = !this.newCampaignCommetns.value.campaignComments[i].isChildrenShow;

      }
    }

  }
  // sendReply(id,reply){   let obj ={     "p_id":id,     "msg":reply   }
  commentNewReply($event){
    //  
this.commentReply.emit($event)
  }
  
}