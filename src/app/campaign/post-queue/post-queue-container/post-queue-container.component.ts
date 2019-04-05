import { Component, OnInit } from '@angular/core';
import { PostToQueueService } from '../../service/post-to-queue.service';
import * as _ from "lodash";
import { PostQueueStore } from 'src/app/store/post-queue-store';
import { CustomMessage } from '../../shared/models/custom-message';
import { BehaviorSubject } from 'rxjs';
import { PostToQueue } from 'src/app/shared/sdk';
import { PostQueueViewModal } from '../model/post-queue-modal';
// import { UserProfile } from 'src/app/store/user-profile';

@Component({
  selector: 'post-queue-container',
  templateUrl: './post-queue-container.component.html',
  styleUrls: ['./post-queue-container.component.css']
})
export class PostQueueContainerComponent implements OnInit {
  constructor(private postToQueueStore: PostQueueStore, private postToQueueService: PostToQueueService) { }
  responseMessage: CustomMessage = new CustomMessage();
  responseMessage$ = new BehaviorSubject(this.responseMessage);
  postToQueue: PostQueueViewModal = new PostQueueViewModal();
  postToQueue$ = new BehaviorSubject(this.postToQueue);
  loaderStatus = { type: '', status: false };
  loaderStatus$ = new BehaviorSubject(this.loaderStatus);
  // profileStore: UserProfile = new UserProfile();

  ngOnInit() {
    if (this.postToQueueStore.postToQueue.Friday || this.postToQueueStore.postToQueue.Monday || this.postToQueueStore.postToQueue.Saturday || this.postToQueueStore.postToQueue.Sunday || this.postToQueueStore.postToQueue.Thursday || this.postToQueueStore.postToQueue.Tuesday || this.postToQueueStore.postToQueue.Wednesday) {
      this.postToQueue$.next(this.postToQueueStore.getTimeSlots);
    }
    else {
      this.getQueueSlots();
    }
  }

  getQueueSlots() {
    this.postToQueueService.getQueues().subscribe(data => {
      this.postToQueue$.next(this.postToQueueStore.getTimeSlots);
    });
  }

  addTimeSlots(timeSlot) {
    this.loaderStatus.type = 'add';
    this.loaderStatus.status = true;
    this.loaderStatus$.next(this.loaderStatus);
    let postFromStore: PostToQueue = new PostToQueue(this.postToQueueStore.postToQueue);
    this.postToQueueService.addTimeSlotsSlot(timeSlot, postFromStore).subscribe(res => {
      this.responseMessage.status = "success";
      this.responseMessage.message = "Succesfully Added!";
      this.responseMessage$.next(this.responseMessage);
      this.postToQueue$.next(this.postToQueueStore.getTimeSlots);

      this.loaderStatus.type = 'add';
      this.loaderStatus.status = false;
      this.loaderStatus$.next(this.loaderStatus);
      setTimeout(() => {
        this.responseMessage.status = "";
        this.responseMessage.message = "";
        this.responseMessage$.next(this.responseMessage);
      }, 2000);
    });
  }

  deleteTimeSlot(timeSlot) {
    this.loaderStatus.type = 'delete';
    this.loaderStatus.status = true;
    this.loaderStatus$.next(this.loaderStatus);
    let day = timeSlot.day
    let slotData;
    let postToQueue: PostToQueue = new PostToQueue(this.postToQueueStore.postToQueue);
    let days = Object.keys(postToQueue);
    for (let a = 0; a < days.length; a++) {
      if (days[a] === day) {
        for (let i = 0; i < postToQueue[days[a]].length; i++) {
          if (postToQueue[days[a]][i].id === timeSlot.id) {
            postToQueue[days[a]].splice(i, 1);
            slotData = postToQueue[days[a]]
            this.postToQueueService.deleteSlot(slotData, postToQueue.id, day).subscribe(res => {
              this.loaderStatus.type = 'delete';
              this.loaderStatus.status = false;
              this.loaderStatus$.next(this.loaderStatus);
            })
          }
        }
      }
    }
    this.postToQueue$.next(this.postToQueueStore.getTimeSlots);
  }
}
