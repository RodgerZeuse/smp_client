import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCampaignContainerComponent } from './CreateCampaign/create-campaign-container/create-campaign-container.component';
import { CampaignCalendarComponent } from './campaign-list/campaign-calendar/campaign-calendar.component';
import { CampainListContainerComponent } from "./campaign-list/campaign-list-container/campaign-list-container.component"
import { EditCampaignContainerComponent } from "./EditCampaign/edit-campaign-container/edit-campaign-container.component";
import { BoxPopupOpenerComponent } from "../external-file-selector/box-selector/box-popup-opener/box-popup-opener.component";
import { PostQueueContainerComponent } from './post-queue/post-queue-container/post-queue-container.component';
export const routes: Routes = [
    { path: '', component: CreateCampaignContainerComponent, data: { name: "Create Campaign" } },
    { path: 'campaign-list', component: CampainListContainerComponent, data: { name: "Campaign List" } },
    { path: 'campaign-calendar', component: CampaignCalendarComponent, data: { name: "Campaign Calendar" } },
    { path: 'edit-campaign', component: EditCampaignContainerComponent, data: { name: "Edit Campaign" } },
    { path: 'box-popup', component: BoxPopupOpenerComponent, data: { name: "Popup Box" } },
    { path: 'post-queue', component: PostQueueContainerComponent, data: { name: "Post to queue" } }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CampaignRoutingModule { }