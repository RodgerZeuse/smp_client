import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SecurityGroupModel } from '../security-group-model';
import { SystemPermissions } from 'src/app/shared/sdk';
import { CompanyUser } from '../user-model';

@Component({
  selector: 'company-groups-definition',
  templateUrl: './company-groups-definition.component.html',
  styleUrls: ['./company-groups-definition.component.css']
})
export class CompanyGroupsDefinitionComponent implements OnInit {

  onUpdateGroup = new EventEmitter();
  permissions: Array<SystemPermissions>;
  users: Array<CompanyUser>;
  groupForm: FormGroup;
  dialogBoxType: string = '';

  constructor(public dialogRef: MatDialogRef<CompanyGroupsDefinitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public securityGroup: SecurityGroupModel) {
  }

  ngOnInit() {
    this.groupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      registerUsers: new FormControl('', Validators.required),
      systemsPermissions: new FormControl('', Validators.required)
    })
    
    if (this.data != null && this.data.data) {
      this.dialogBoxType = "Edit";
      this.securityGroup.id = this.data.data.id;
      this.securityGroup.name = this.data.data.name;
      this.securityGroup.registerUsers= this.data.data.registerUsers;
      this.securityGroup.systemsPermissions = this.data.data.systemsPermissions;
    }
    else {
      this.dialogBoxType = "Add"
      this.securityGroup = new SecurityGroupModel();
    }    
  }

  addOrUpdateGroup() {
    this.securityGroup.name = this.groupForm.controls.name.value;
    this.securityGroup.registerUsers= this.groupForm.controls.registerUsers.value;
    this.securityGroup.systemsPermissions = this.groupForm.controls.systemsPermissions.value;
    this.onUpdateGroup.emit(this.securityGroup);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
