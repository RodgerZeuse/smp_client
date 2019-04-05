import { Injectable } from '@angular/core';
import { UserProfile } from '../../../store/user-profile';
import { CampaignStatusStore } from "../../../store/campaign-status-store";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { CampaignStatusApi, CampaignStatus } from '../../../shared/sdk';

@Injectable({
  providedIn: 'root'
})
export class CamapignStatusService {
  constructor(private campaignStatusStore: CampaignStatusStore, private userProfile: UserProfile, private statusApi: CampaignStatusApi) { }

  updateCamapaignStatus(statusId, status) {
    return this.statusApi.patchAttributes(statusId, { status: status })
      .map(res => {
        this.campaignStatusStore.editCustomStatus(statusId, res);
        return res;
      });
  }

  addCamapaignStatus(newStatus) {
    let userStatus = {
      registerUserId: this.userProfile.userId,
      status: newStatus
    }
    return this.statusApi.create(userStatus).map((res1: CampaignStatus) => {
      this.campaignStatusStore.addCustomStatus(res1);
    })
  }

  deleteCamapaignStatus(statusId) {
    return this.statusApi.deleteById(statusId).map(res => {
      this.campaignStatusStore.removeCustomStatus(statusId);
      return res;
    })
  }

  getCustomStatus() {
    return this.statusApi.find({ where: { "registerUserId": this.userProfile.userId } }).map((res: Array<CampaignStatus>) => {
      this.campaignStatusStore.setCustomStatus(res);
      return res;
    })
  }
}
