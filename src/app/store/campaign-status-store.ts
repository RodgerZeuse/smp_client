import { observable, action } from 'mobx';
import { Injectable } from '@angular/core';
import { CampaignStatus } from '../shared/sdk';
import { computed } from 'mobx-angular';

@Injectable()
export class CampaignStatusStore {
    @observable customStatuses: Array<CampaignStatus> = Array<CampaignStatus>();

    @action addCustomStatus(customStatus: CampaignStatus) {
        this.customStatuses = this.customStatuses.concat(customStatus);
    }

    @action editCustomStatus(statusId: string, customStatus: CampaignStatus) {
        let indexOfEdittedStatus = this.customStatuses.findIndex(x => x.id == statusId);
        this.customStatuses[indexOfEdittedStatus] = customStatus;
    }

    @action setCustomStatus(customStatuses: Array<CampaignStatus>) {
        this.customStatuses = customStatuses.map(x => Object.assign({}, x));
    }

    @action removeCustomStatus(statusId: string) {
        this.customStatuses.splice((this.customStatuses.indexOf(this.customStatuses.find(status => status.id == statusId))), 1);
    }
    
    @computed get publishableStatuses(){
        return this.customStatuses.filter(x=>x.status.isPublishable && x.status.isPublishable==true);
    }
}