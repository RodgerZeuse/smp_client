import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignFeedbackComponent } from './campaign-feedback/campaign-feedback.component';
import { SharedModule } from '../shared/shared.module';
import { FeaturesRoutingModule } from './features.routes';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { WrappedSocket } from 'ng-socket-io/dist/src/socket-io.service';
const url = require('../shared/config/urls.json').END_POINT_URL;
const config: SocketIoConfig = { url: url, options: {} };
@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,
    SocketIoModule.forRoot(config)
  ],
  providers:[WrappedSocket],
  declarations: [CampaignFeedbackComponent]
})
export class FeaturesModule { }
