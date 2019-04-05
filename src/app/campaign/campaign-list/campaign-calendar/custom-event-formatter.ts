import { LOCALE_ID, Inject, Component } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Campaign } from '../../../shared/sdk';
import { CampaignsStore } from '../../../store/campaigns-store';

@Component({
  styleUrls: ['./campaign-calendar.component.css'],
})
export class CustomEventFormatter extends CalendarEventTitleFormatter{
  constructor(@Inject(LOCALE_ID) private locale: string, private campainStore: CampaignsStore) {
    super();
  }

  month(event: CalendarEvent): string {
  let campaign:Campaign= this.campainStore.campaignById(event.id);
  let datatoshow:string=`<div class="c-container">
  <div class="row">
  <div class="col-12 text-center"><big>${campaign.title}</big></div>
  <div class="col-3">Description:</div><div class="col-9">${campaign.description}</div> 
  <div class="col-3">state:</div><div class="col-9">${campaign.state}</div>
  <div class="col-3">Created At:</div><div class="col-9">${new DatePipe(this.locale).transform(campaign.createdAt,'dd/MM/yyyy hh:mm a',this.locale)}</div> 
  <div class="col-3">Scheduled At:</div><div class="col-9">${new DatePipe(this.locale).transform(campaign.scheduledAt,'dd/MM/yyyy hh:mm a',this.locale)}</div> 
</div>
</div>`;
  // <div class="col-3">Hash Tags:</div><div class="col-9">${campaign.hashTags.join(" ")}</div>

    return datatoshow;
  }
}
