import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SearchCriteria } from "../model/search-criteria";
import * as moment from "moment";
import { CampaignsStore } from '../../../store/campaigns-store';
import { SearchCampaign } from './search-campaign-model';
import { UserProfile } from 'src/app/store/user-profile';
@Component({
  selector: 'search-campaign',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-campaign.component.html',
  styleUrls: ['./search-campaign.component.css']
})

export class SearchCampaignComponent implements OnInit {
  @Output() search: EventEmitter<SearchCriteria> = new EventEmitter<SearchCriteria>();
  @Output() searchForCampaign: EventEmitter<SearchCampaign> = new EventEmitter<SearchCampaign>();
  @Output() toogleArchive: EventEmitter<boolean> = new EventEmitter<boolean>();

  groupRights = require("../../../shared/config/group-rights.json").groupRights;

  isArchiveOn: boolean = false;
  searchCampaignModel: SearchCampaign = new SearchCampaign();
  createdDateBetween: boolean = false;
  scheduledDateBetween: boolean = false;
  criteria: Object;

  constructor(private campaignstore: CampaignsStore,private profileStore:UserProfile) {
    this.searchCampaignModel.createdAtCriteria = "createBetweenDates";
    this.searchCampaignModel.scheduledAtCriteria = 'scheduledSelectedDate';
  }

  showArchive() {
    this.isArchiveOn = !this.isArchiveOn;
    this.toogleArchive.emit(this.isArchiveOn);
    console.log("toogle", this.isArchiveOn);
  }
  
  searchCampaign() {
    this.campaignstore.searchCriteria = new SearchCriteria();
    let createdStartDate = moment(this.searchCampaignModel.createdStartDate).add(86399, 'seconds');
    let createdEndDate = moment(this.searchCampaignModel.createdEndDate).add(86399, 'seconds');
    let scheduledStartDate = moment(this.searchCampaignModel.scheduledStartDate).add(86399, 'seconds');
    let scheduledEndDate = moment(this.searchCampaignModel.scheduledEndDate).add(86399, 'seconds');
    let searchByTitle = { or: [{ description: { like: this.searchCampaignModel.title, "options": "i" } }, { title: { like: this.searchCampaignModel.title, "options": "i" } }] };
    let searchCreateBySelectedDate = { createdAt: { between: [this.searchCampaignModel.createdStartDate, createdStartDate] } };
    let searchCreateBetweenDates = { createdAt: { between: [this.searchCampaignModel.createdStartDate, createdEndDate] } };
    let searchScheduleBySelectedDate = { scheduledAt: { between: [this.searchCampaignModel.scheduledStartDate, scheduledStartDate] } };
    let searchScheduleBetweenDates = { scheduledAt: { between: [this.searchCampaignModel.scheduledStartDate, scheduledEndDate] } }
    let searchByState = { state: this.searchCampaignModel.state };

    if (!this.searchCampaignModel.title && !this.searchCampaignModel.createdStartDate && !this.searchCampaignModel.createdEndDate && !this.searchCampaignModel.state && this.searchCampaignModel.scheduledStartDate && this.searchCampaignModel.scheduledEndDate) {
      this.criteria = null;
    }
    if (this.searchCampaignModel.title) {
      if (this.criteria) {
        this.criteria = { and: [this.criteria, searchByTitle] };
      }
      else {
        this.criteria = searchByTitle;
      }
      this.campaignstore.searchCriteria.title = this.searchCampaignModel.title;
    }
    if (this.searchCampaignModel.state) {
      if (this.criteria) {
        this.criteria = { and: [this.criteria, searchByState] }
      }
      else {
        this.criteria = searchByState;
      }
      this.campaignstore.searchCriteria.state = this.searchCampaignModel.state;
    }
    if (this.searchCampaignModel.createdStartDate && !this.searchCampaignModel.createdEndDate) {
      if (this.criteria) {
        this.criteria = { and: [this.criteria, searchCreateBySelectedDate] }
      }
      else {
        this.criteria = searchCreateBySelectedDate;
      }
      this.campaignstore.searchCriteria.createdStartDate = this.searchCampaignModel.createdStartDate;
    }
    if (this.searchCampaignModel.createdStartDate && this.searchCampaignModel.createdEndDate) {
      if (this.criteria) {
        this.criteria = { and: [this.criteria, searchCreateBetweenDates] }
      }
      else {
        this.criteria = searchCreateBetweenDates;
      }
      this.campaignstore.searchCriteria.createdStartDate = this.searchCampaignModel.createdStartDate;
      this.campaignstore.searchCriteria.createdEndDate = this.searchCampaignModel.createdEndDate;
    }
    if (this.searchCampaignModel.scheduledStartDate && !this.searchCampaignModel.scheduledEndDate) {
      if (this.criteria) {
        this.criteria = { and: [this.criteria, searchScheduleBySelectedDate] }
      }
      else {
        this.criteria = searchScheduleBySelectedDate;
      }
      this.campaignstore.searchCriteria.scheduledStartDate = this.searchCampaignModel.scheduledStartDate;
    }
    if (this.searchCampaignModel.scheduledStartDate && this.searchCampaignModel.scheduledEndDate) {
      if (this.criteria) {
        this.criteria = { and: [this.criteria, searchScheduleBetweenDates] }
      }
      else {
        this.criteria = searchScheduleBetweenDates;
      }
      this.campaignstore.searchCriteria.scheduledStartDate = this.searchCampaignModel.scheduledStartDate;
      this.campaignstore.searchCriteria.scheduledEndDate = this.searchCampaignModel.scheduledEndDate;
    }
    this.searchForCampaign.emit(this.searchCampaignModel);
    this.search.emit(this.criteria);
    this.criteria = null;
  }

  createdSearchCriteria() {
    if (this.searchCampaignModel.createdAtCriteria == "createSelectedDate") {
      this.createdDateBetween = false;
      this.searchCampaignModel.createdEndDate = null;
    }
    else {
      this.createdDateBetween = true;
    }
  }

  scheduledSearchCriteria() {
    if (this.searchCampaignModel.scheduledAtCriteria == "scheduledSelectedDate") {
      this.scheduledDateBetween = false;
      this.searchCampaignModel.scheduledEndDate = null;
    }
    else {
      this.scheduledDateBetween = true;
    }
  }

  clearCriteria() {
    this.searchCampaignModel = new SearchCampaign();
    this.searchCampaignModel.createdAtCriteria = "createSelectedDate";
    this.searchCampaignModel.scheduledAtCriteria = "scheduledSelectedDate";
    this.createdDateBetween = false;
    this.scheduledDateBetween = false;
    this.criteria = null;
    this.campaignstore.searchCriteria = null;
  }

  ngOnInit() {
    this.createdSearchCriteria();
    if (this.campaignstore.criteria) {
      this.searchCampaignModel.title = this.campaignstore.searchCriteria.title;
      this.searchCampaignModel.state = this.campaignstore.searchCriteria.state;
      this.searchCampaignModel.scheduledStartDate = this.campaignstore.searchCriteria.scheduledStartDate;
      this.searchCampaignModel.scheduledEndDate = this.campaignstore.searchCriteria.scheduledEndDate;
      this.criteria = this.campaignstore.criteria;
      if (this.campaignstore.searchCriteria.createdStartDate && this.campaignstore.searchCriteria.createdEndDate) {
        this.searchCampaignModel.createdStartDate = this.campaignstore.searchCriteria.createdStartDate;
        this.searchCampaignModel.createdEndDate = this.campaignstore.searchCriteria.createdEndDate;
      }
    }
    else {
      this.searchCampaignModel.createdStartDate = moment().subtract(168, 'hours').toDate();
      this.searchCampaignModel.createdEndDate = new Date();
      this.criteria = { createdAt: { between: [this.searchCampaignModel.createdStartDate, this.searchCampaignModel.createdEndDate] } };
      this.campaignstore.searchCriteria.createdStartDate = this.searchCampaignModel.createdStartDate;
      this.campaignstore.searchCriteria.createdEndDate = this.searchCampaignModel.createdEndDate;
      this.search.emit(this.criteria);
    }
    this.searchForCampaign.emit(this.searchCampaignModel);
  }
}
