import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Campaign } from '../../../shared/sdk/models';

@Component({
  selector: 'delete-campaign',
  templateUrl: './delete-campaign.component.html',
  styleUrls: ['./delete-campaign.component.css']
})
export class DeleteCampaignComponent {
  @Input() campaign: Campaign;
  @Output() removeCampain: EventEmitter<Campaign> = new EventEmitter<Campaign>();

  removeCampaign() {
    this.removeCampain.emit(this.campaign);
  }
}
