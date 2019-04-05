import { Injectable } from "@angular/core";
import { observable, action, computed } from "mobx-angular";
import { PostQueueViewModal } from "../campaign/post-queue/model/post-queue-modal";

@Injectable()
export class PostQueueStore {
    @observable postToQueue: PostQueueViewModal = new PostQueueViewModal();

    @action setTimeSlot(postToQueues: PostQueueViewModal) {
        this.postToQueue = Object.assign({}, postToQueues);
    }

    @computed get getTimeSlots() {
        let sortedQueue: PostQueueViewModal = new PostQueueViewModal();
        if (this.postToQueue.Monday) {
            sortedQueue.Monday = this.postToQueue.Monday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        if (this.postToQueue.Tuesday) {
            sortedQueue.Tuesday = this.postToQueue.Tuesday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        if (this.postToQueue.Wednesday) {
            sortedQueue.Wednesday = this.postToQueue.Wednesday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        if (this.postToQueue.Thursday) {
            sortedQueue.Thursday = this.postToQueue.Thursday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        if (this.postToQueue.Friday) {
            sortedQueue.Friday = this.postToQueue.Friday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        if (this.postToQueue.Saturday) {
            sortedQueue.Saturday = this.postToQueue.Saturday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        if (this.postToQueue.Sunday) {
            sortedQueue.Sunday = this.postToQueue.Sunday.sort((a, b) => {
                if (a.from.hour == b.from.hour) {
                    return a.from.minute - b.from.minute;
                }
                else {
                    return a.from.hour - b.from.hour;
                }
            });
        }
        return sortedQueue;
    }

}