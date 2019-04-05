import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule, MatIconModule, MatSidenavModule, MatListModule, MatProgressBarModule, MatFormFieldModule } from '@angular/material';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CampaignStatusDefinitionComponent } from "./campaign-status-definition/campaign-status-definition.component";
import { CamapignStatusRoutingModule } from './camapignStatus.routes';
import { CamapignStatusService } from './service/camapign-status.service';
import { GridCampaignStatusComponent } from './grid-campaign-status/grid-campaign-status.component';
import { CampaignStatusContainerComponent } from './campaign-status-container/campaign-status-container.component';
import { DisableSlideToggleComponent } from './disable-slide-toggle/disable-slide-toggle.component';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
    imports: [
        CommonModule,
        MatGridListModule,
        MatIconModule,
        MaterialModule,
        MatSidenavModule,
        MatListModule,
        MatProgressBarModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CamapignStatusRoutingModule,
        ColorPickerModule
    ],
    declarations: [DisableSlideToggleComponent,CampaignStatusContainerComponent, CampaignStatusDefinitionComponent, GridCampaignStatusComponent],
    providers: [CamapignStatusService],
    exports: [],
    entryComponents:[CampaignStatusDefinitionComponent]
})
export class CampaignStatusModule { }