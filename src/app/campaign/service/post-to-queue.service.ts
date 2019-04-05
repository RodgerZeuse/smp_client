import { Injectable } from '@angular/core';
import { UserProfile } from '../../store/user-profile';
import { PostToQueueApi, PostToQueue } from '../../shared/sdk';
import { PostQueueStore } from 'src/app/store/post-queue-store';
import { PostQueueViewModal } from '../post-queue/model/post-queue-modal';

@Injectable({
  providedIn: 'root'
})

export class PostToQueueService {
  constructor(private userProfile: UserProfile, private postToQueueApi: PostToQueueApi, private postToQueueStore: PostQueueStore) { }

  getQueues() {
    return this.postToQueueApi.find({ where: { "registerUserId": this.userProfile.userId } }).map((data: Array<PostQueueViewModal>) => {
      if (data && data.length > 0) {
        this.postToQueueStore.setTimeSlot(data[0]);
      }
      else {
        this.postToQueueStore.setTimeSlot(new PostQueueViewModal);
      }
    })
  }

  addTimeSlotsSlot(timeSlot, postToQueue: PostToQueue) {
    let timeSlotToAdd;
    let slotData =
    {
      "from": timeSlot.from,
      "to": timeSlot.to,
      "id": timeSlot.id,
      "isAvailable": timeSlot.isAvailable
    }

    let day = timeSlot.day;
    let timeSlotToCreate = Object.assign({ [day]: [slotData], "registerUserId": this.userProfile.userId });
    let daysName = Object.keys(postToQueue);
    let index = daysName.indexOf(day);
    if (daysName[index] === timeSlot.day && postToQueue[day]) {
      postToQueue[day].push(slotData);
      timeSlotToAdd = Object.assign({ [daysName[index]]: postToQueue[day] });
    }

    if (postToQueue.registerUserId == this.userProfile.userId) {
      let id = postToQueue.id;
      return this.postToQueueApi.patchAttributes(id, timeSlotToAdd).map(res => {
        this.postToQueueStore.setTimeSlot(res);
        return res;
      })
    } else {
      return this.postToQueueApi.create(timeSlotToCreate).map((data: PostQueueViewModal) => {
        this.postToQueueStore.setTimeSlot(data);
        return data;
      })
    }
  }

  deleteSlot(slotData, id, day) {
    let timeSlotToDelete = Object.assign({ [day]: slotData });
    return this.postToQueueApi.patchAttributes(id, timeSlotToDelete).map((res: PostQueueViewModal) => {
      this.postToQueueStore.setTimeSlot(res)
      return res;
    })
  }
}

