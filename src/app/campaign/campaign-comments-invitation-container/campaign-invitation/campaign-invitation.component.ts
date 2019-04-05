import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CampaignInvitaitonViewModel } from '../model/campaign-invitation-view-Model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'campaign-invitation',
  templateUrl: './campaign-invitation.component.html',
  styleUrls: ['./campaign-invitation.component.css']
})
export class CampaignInvitationComponent implements OnInit {
@Output() isClose: EventEmitter<boolean> = new EventEmitter<boolean>();
@Output() formData: EventEmitter<CampaignInvitaitonViewModel> = new EventEmitter<CampaignInvitaitonViewModel>();
  data:CampaignInvitaitonViewModel;
  externalUserForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.data = new CampaignInvitaitonViewModel();
    this.externalUserFormValidate();
  }
  closePopup = () =>{
    this.isClose.emit(true)
  }
  sendInvitation = () =>{
    this.formData.emit(this.data);
  }
  externalUserFormValidate = () =>{
      this.externalUserForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9.]+@[a-z$]+\.[a-z]{2,3}$")])],
        firstName:  ['', Validators.required],
        lastName:  ['', Validators.required],
      });
    
  }
}
