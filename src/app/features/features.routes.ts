import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignFeedbackComponent } from './campaign-feedback/campaign-feedback.component';
export const routes: Routes = [
    { path: ':id', component: CampaignFeedbackComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeaturesRoutingModule { }