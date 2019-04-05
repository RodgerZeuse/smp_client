import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule, MatIconModule, MatIcon, MatSidenavModule, MatListModule, MatProgressBarModule, MatFormFieldModule, MatSlideToggleModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import { UserDefinitionComponent } from "./user-definition/user-definition.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ManageCompanyComponent } from './manage-company/manage-company.component';
import { ManageCompanyRoutingModule } from './manage-company-routes';
import { CompanyUser } from './user-model';
import { ManageCompanyContainerComponent } from './manage-company-container/manage-company-container.component';
import { CampaignModule } from '../campaign/campaign.module';
import { CompanyGroupsDefinitionComponent } from './company-groups-definition/company-groups-definition.component';
import { CompanyGroupsListComponent } from './company-groups-list/company-groups-list.component';
import { SecurityGroupModel } from './security-group-model';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule,
    MatIconModule,
    MaterialModule,
    MatListModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatIconModule,
    MatSlideToggleModule,
    ManageCompanyRoutingModule,
    CampaignModule
  ],
  declarations: [ManageCompanyComponent,
    CompanyGroupsListComponent,
    CompanyGroupsDefinitionComponent,
    UserDefinitionComponent,
    ManageCompanyContainerComponent
  ],
  providers: [CompanyUser,SecurityGroupModel],
  exports: [ManageCompanyComponent],
  entryComponents: [UserDefinitionComponent,CompanyGroupsDefinitionComponent]
})
export class ManageCompanyModule { }
