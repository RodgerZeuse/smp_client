import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { MaterialModule } from '../material.module';
import { ProfileContainerComponent } from './profile-container/profile-container.component';
import { ProfileInfoComponent } from './profile-container/profile-info/profile-info.component';
import { EidtProfileComponent } from './profile-container/eidt-profile/eidt-profile.component';
import { ProfileRoutingModule } from './profile.routes';
import { SharedModule } from '../shared/shared.module';
import { FormsModule }   from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MaterialModule,
    ProfileRoutingModule,
    MatGridListModule,
    MatCardModule,
    SharedModule,
    FormsModule
  ],
  declarations: [ProfileCardComponent, ProfileContainerComponent, ProfileInfoComponent, EidtProfileComponent],
  exports: [ProfileCardComponent]
})
export class ProfileModule { }
