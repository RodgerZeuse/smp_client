import { observable, action, computed } from 'mobx';
import { Injectable } from "@angular/core";
import { Campaign, Post } from '../shared/sdk/models';
import { SearchCriteria } from '../campaign/campaign-list/model/search-criteria';
import * as moment from 'moment';
import * as _ from "lodash";
import { CampaignListViewModel } from '../campaign/shared/models/campaignListViewModel';
@Injectable()
export class CampaignsStore {
    @observable campaignsListFromStore: Array<Campaign> = [];
    @observable criteria: Object;
    @observable searchCriteria: SearchCriteria = new SearchCriteria();
    @observable networkCount: number = 0;
    @observable already = false;
    @observable difference: boolean = false;
    interval: string
    @observable campaignComments: Array<Campaign> = [];
    @observable campaignsListView: Array<CampaignListViewModel> = [];
    // @observable campaignListView: CampaignListViewModel= new CampaignListViewModel();

    @action addCampaignCommnets(data) {
        this.campaignComments = data;
    }

    @action reset = () => {
        this.campaignsListFromStore = [];
        this.criteria ={};
        this.searchCriteria = {};
        this.networkCount = 0;
        this.campaignComments = [];
        this.campaignsListView = [];
    }

    @computed get campaignForListView() {
        // console.log("list view", this.campaignsListView);
        return this.campaignsListView;
    }

    @action convertServerCampaignsToListView() {
        this.campaignsListView = [];
        if (this.campaignsListFromStore.length > 0) {
            this.campaignsListFromStore.forEach(x => {
                let campaignListViewModel: CampaignListViewModel = new CampaignListViewModel();
                campaignListViewModel.populateFromServerModel(x);
                this.campaignsListView.push(campaignListViewModel);
            }
            )
        }
        console.log("list view", this.campaignsListView);
    }

    @action resetCampaignComments() {
        this.campaignComments = []
    }

    @action setCampaigns(campaigns: Array<Campaign>) {
        this.campaignsListFromStore = [...campaigns];
        this.convertServerCampaignsToListView();
    }

    @action getNewCampaing(campaign: Campaign) {
        this.campaignsListFromStore.push(campaign);
        this.convertServerCampaignsToListView();
    }

    @action addNewCampaigns(campaigns: Array<Campaign>) {
        this.campaignsListFromStore = this.campaignsListFromStore.concat([...campaigns]);
        this.convertServerCampaignsToListView();
    }

    @action setCriteria(criteria: Object) {
        this.criteria = criteria;
    }

    @action removeCampaign(campaign: Campaign) {

        this.campaignsListFromStore.splice(this.campaignsListFromStore.findIndex(x=>x.id==campaign.id));
        this.convertServerCampaignsToListView();
    }

    @action campaignById(id: string | number): Campaign {
        return this.campaignsListFromStore.find(campaign => campaign.id == id);
    }

    @action rescheduleCampaign(id, newDate) {
        this.campaignsListFromStore.forEach(campaign => {
            if (campaign.id == id) {
                let i = this.campaignsListFromStore.indexOf(campaign);
                let scheduledCampain: Campaign = campaign;
                scheduledCampain.scheduledAt = newDate;
                this.campaignsListFromStore[i] = scheduledCampain;
            }
        });
        this.convertServerCampaignsToListView();
    }

    @action setNetwork(posts: Array<any>, network: string) {
        this.networkCount = posts.filter(post => post.network == network).length;
    }
}