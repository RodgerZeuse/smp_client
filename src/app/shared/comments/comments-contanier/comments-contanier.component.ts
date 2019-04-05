import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {CampaignService} from './../../../campaign/shared/service/campaign.service';
import {Campaign} from '../../../shared/sdk';
import {CampaignsStore} from '../../../store/campaigns-store';
// import { CampaignService } from '../../../campaign/service/campaign.service';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { CampaignCommentsInvitationContainerComponent } from '../../../campaign/campaign-comments-invitation-container/campaign-comments-invitation-container.component';
@Component({selector: 'comments-contanier', templateUrl: './comments-contanier.component.html', styleUrls: ['./comments-contanier.component.css'], changeDetection: ChangeDetectionStrategy.OnPush})
export class CommentsContanierComponent implements OnInit {
  @Input() campaignComments$: Observable < Campaign >;
  @Input() type : string ;
  @Output() newComment:EventEmitter<string> = new EventEmitter<string>();
  @Output() commentReply:EventEmitter<object> = new EventEmitter<object>();
  comments$ : Observable < Array < Campaign >>;
  tempComment$ = new BehaviorSubject(this.campaignStore.campaignComments);
  campaignId : string;
  newCampaignCommetns = new BehaviorSubject(this.campaignComments$);
  constructor(public campaignService : CampaignService, public campaignStore : CampaignsStore,public dialog: MatDialog) {}

  ngOnInit() {

   if (this.campaignComments$) {
 
    this
      .campaignComments$
      .subscribe((comment:any) => {
         
        if (comment && comment.campaignComments && comment.campaignComments.length > 0) {
          this.campaignId = comment.id;
          for (let i = 0; i < comment.campaignComments.length; i++) {
            comment.campaignComments[i].children = [];
            comment.campaignComments[i].isChildrenShow = false;
            if (comment.campaignComments[i].parent) {
              for (let j = 0; j < comment.campaignComments.length; j++) {
                if (comment.campaignComments[i].parent === comment.campaignComments[j].id) {

                  comment.campaignComments[j].children.push(comment.campaignComments[i]);
                  this.newCampaignCommetns.next(comment);

                }
              }

            }
            else{
              this.newCampaignCommetns.next(comment);
            }
          }
        }

      })
  }
  }

  emitNewComment($event) {
    this.newComment.emit($event);
  }
  reply($event) {
    //  
    this.commentReply.emit($event);
    // this
    //   .campaignService
    //   .replyComment(this.campaignId, $event.msg, $event.p_id)
    //   .subscribe(res => {})
  }
  sendInvitation = () =>{
    const dialogRef = this.dialog.open(CampaignCommentsInvitationContainerComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.campaignService.sendInvitation(this.campaignId,result).subscribe(res =>{
          console.log("invition data", res)
        })
      }
    });
  }
}
