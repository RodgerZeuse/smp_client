import { Component, OnInit } from "@angular/core";
import { ManageCompanyService } from "../manage-company.service";
import { BehaviorSubject } from "rxjs";
import { CompanyUser } from "../user-model";
import { ManageCompanyStore } from "src/app/store/manage-company-store";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { UserProfile } from "src/app/store/user-profile";
import { UserDefinitionComponent } from "../user-definition/user-definition.component";
import { CompanyGroupsDefinitionComponent } from "../company-groups-definition/company-groups-definition.component";
import { SecurityGroupModel } from "../security-group-model";
import { SystemPermissions } from "src/app/shared/sdk";

@Component({
  selector: "app-manage-company-container",
  templateUrl: "./manage-company-container.component.html",
  styleUrls: ["./manage-company-container.component.css"]
})
export class ManageCompanyContainerComponent implements OnInit {
  activeView: string = "user";
  socialAccountsDetail: Array<CompanyUser>;
  socialAccountsDetail$ = new BehaviorSubject(this.socialAccountsDetail);
  systemPermissions: Array<SystemPermissions>;
  systemPermissions$ = new BehaviorSubject(this.systemPermissions);
  securityGroups: Array<SecurityGroupModel>;
  securityGroups$ = new BehaviorSubject(this.securityGroups);

  constructor(
    private companyStore: ManageCompanyStore,
    private companyService: ManageCompanyService,
    private profileStore: UserProfile,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getCompanyDetails();
    this.getPermissions();
  }

  manageUserData() {
    this.activeView = "user";
  }

  manageGroupData() {
    this.activeView = "group";
  }

  getCompanyDetails() {
    if (this.profileStore.userAccountType == "company" || this.profileStore.userAccountType == "companyUser") {
      if (this.profileStore.company) {
        this.getUserAccounts();
        this.getSecurityGroups();
      } else {
      this.companyService.getCurrentUserCompany().subscribe(res => {
        this.getUserAccounts();
        this.getSecurityGroups();
      });
      }
    }
  }

  getUserAccounts() {
    if (this.companyStore.companyUsers.length > 0) {
      this.socialAccountsDetail$.next(this.companyStore.companyUsers);
    } else {
    this.companyService.getUserAccounts().subscribe(data => {
      this.socialAccountsDetail$.next(this.companyStore.companyUsers);

    });
    }
  }

  getSecurityGroups() {
    if (this.companyStore.companyUsers.length > 0) {
      this.securityGroups$.next(this.companyStore.securityGroups);
    } else {
    this.companyService.getSecurityGroups().subscribe(res => {
      this.securityGroups$.next(this.companyStore.securityGroups);
    });
    }
  }

  getPermissions() {
    if (this.companyStore.permissions.length > 0) {
      this.systemPermissions = this.companyStore.permissions;
    } else {
      this.companyService.getSystemPermission().subscribe(permissions => {
        this.systemPermissions = this.companyStore.permissions;
      });
    }
  }

  deleteCompanyUser(userId) {
    this.profileStore.loaderStart();
    this.companyService.deleteCompanyUser(userId).subscribe(data => {
      this.socialAccountsDetail$.next(this.companyStore.companyUsers);
      this.profileStore.loaderEnd();
    });
  }

  deleteSecurityGroup(groupId) {
    this.profileStore.loaderStart();
    this.companyService.deleteSecurityGroup(groupId).subscribe(data => {
      this.securityGroups$.next(this.companyStore.securityGroups);
      this.profileStore.loaderEnd();
    });
  }

  updataCompanyUser(user: CompanyUser) {
    const dialogBoxConfiguration = new MatDialogConfig();
    dialogBoxConfiguration.data = user ? user : null;
    const dialogBoxReferance = this.dialog.open(UserDefinitionComponent, {
      width: "500px",
      height: "auto",
      data: dialogBoxConfiguration,
      panelClass: "myclass",
      disableClose: true
    });
    let dialogInstance = dialogBoxReferance.componentInstance;
    if (user) {
      dialogBoxReferance.componentInstance.onUpdateAccount.subscribe(
        userData => {
          dialogInstance.closeDialog();
          this.profileStore.loaderStart();
          this.companyService
            .updateCompanyUser(dialogInstance.companyUser)
            .subscribe(res => {
              this.socialAccountsDetail$.next(this.companyStore.companyUsers);
              this.profileStore.loaderEnd();
            });
        }
      );
    } else {
      dialogBoxReferance.componentInstance.onUpdateAccount.subscribe(res => {
        this.companyService.validateEmail(res.email).subscribe(emailExist => {
          dialogInstance.companyUser.account_type = "companyUser";
          if (emailExist == true) {
            dialogInstance.emailExist = true;
            setTimeout(() => {
              dialogInstance.emailExist = false;
            }, 2000);
          } else {
            dialogInstance.closeDialog();
            this.profileStore.loaderStart();
            this.companyService
              .addUserAccount(dialogInstance.companyUser)
              .subscribe(res => {
                this.socialAccountsDetail$.next(this.companyStore.companyUsers);
                this.profileStore.loaderEnd();
              });
          }
        });
      });
    }
  }

  updateSecurityGroup(group: SecurityGroupModel) {
    const dialogBoxConfiguration = new MatDialogConfig();
    dialogBoxConfiguration.data = group ? group : null;
    const dialogBoxReferance = this.dialog.open(
      CompanyGroupsDefinitionComponent,
      {
        width: "500px",
        height: "auto",
        data: dialogBoxConfiguration,
        disableClose: true
      }
    );
    let dialogInstance = dialogBoxReferance.componentInstance;
    dialogInstance.permissions = this.systemPermissions;
    dialogInstance.users = this.companyStore.companyUsers;

    if (group) {
      dialogBoxReferance.componentInstance.onUpdateGroup.subscribe(
        // this.companyService.getGroupUsers(group.id).subscribe(users => {
        // })
        groupData => {
          dialogInstance.closeDialog();
          this.profileStore.loaderStart();
          this.companyService
            .updateSecurityGroup(dialogInstance.securityGroup)
            .subscribe(res => {
              this.securityGroups$.next(this.companyStore.securityGroups);
              this.profileStore.loaderEnd();
            });
        }
      );
    } else {
      dialogBoxReferance.componentInstance.onUpdateGroup.subscribe(
        groupData => {
          dialogInstance.closeDialog();
          this.profileStore.loaderStart();
          this.companyService
            .addSecurityGroup(dialogInstance.securityGroup)
            .subscribe(res => {
              this.securityGroups$.next(this.companyStore.securityGroups);
              this.profileStore.loaderEnd();
            });
        }
      );
    }
  }
}
