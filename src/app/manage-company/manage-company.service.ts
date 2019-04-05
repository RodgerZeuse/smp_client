import { Injectable } from "@angular/core";
import { RegisterUserApi, CompanyMemberSocialAccountApi, SecurityGroupApi, SystemPermissionsApi, SystemPermissions, CompanyApi, Company } from "../shared/sdk";
import { UserProfile } from "../store/user-profile";
import { ManageCompanyStore } from "../store/manage-company-store";
import { SecurityGroupModel } from "./security-group-model";

@Injectable({
  providedIn: "root"
})

export class ManageCompanyService {
  constructor(
    private accountPermission: CompanyMemberSocialAccountApi,
    private companyApi: CompanyApi,
    private registerUserApi: RegisterUserApi,
    public securityGroupApi: SecurityGroupApi,
    private companyStore: ManageCompanyStore,
    private systemPemissions: SystemPermissionsApi,
    private profileStore: UserProfile
  ) { }

  getCurrentUserCompany() {
    // return this.registerUserApi
    //   .getMyCompany(this.profileStore.userId,false)
    //   .map(res => {
    //     console.log("Resp is", res);
    //     this.profileStore.setCompany(res);
    //     return res;
    //   });
    return this.companyApi.find({ "where": { "id": this.profileStore.company.id }, "include": { "securityGroups": "registersUsers" } }).map((res: Array<Company>) => {
      this.profileStore.setCompany(res[0]);
      return res[0];
    })
  }

  getUserAccounts() {
    return this.companyApi
      .getRegisterUsers(this.profileStore.company.id)
      .map(res => {
        this.companyStore.setCompanyUsers(res);
        return res;
      });
  }

  getSecurityGroups() {
    return this.companyApi
      .getSecurityGroups(this.profileStore.company.id)
      .map((securityGroup: Array<SecurityGroupModel>) => {
        this.companyStore.setCompanyGroups(securityGroup);
        return securityGroup;
      });
  }

  getSystemPermission() {
    return this.systemPemissions.find().map((res: Array<SystemPermissions>) => {
      this.companyStore.setPermissions(res);
      return res;
    });
  }

  addUserAccount(user) {
    return this.companyApi
      .createRegisterUsers(this.profileStore.company.id, user)
      .map(res => {
        this.companyStore.addNewCompanyUser(res);
        return res;
      });
  }

  addSecurityGroup(group) {
    return this.companyApi
      .createSecurityGroups(this.profileStore.company.id, group)
      .map(res => {
        res.registerUsers.forEach(registerUserId => {
          this.securityGroupApi.linkRegistersUsers(res.id, registerUserId).subscribe(res => {
            this.registerUserApi.linkSecurityGroups(registerUserId, res.id).subscribe(res => {
            });
          });
        });
        this.companyStore.addNewCompanyGroup(res);
        return res;
      });
  }

  validateEmail(validateEmail: string) {
    return this.registerUserApi.validateEmail(validateEmail).map(res => {
      return res;
    });
  }

  deleteCompanyUser(userId) {
    return this.companyApi.destroyByIdRegisterUsers(this.profileStore.company.id, userId).map(res => {
      this.companyStore.removeCompanyUsers(userId);
      return res;
    });
  }

  deleteSecurityGroup(groupId) {
    return this.companyApi.destroyByIdSecurityGroups(this.profileStore.company.id, groupId).map(res => {
      this.companyStore.removeSecurityGroup(groupId);
    });
  }

  createTeamMember(obj) {
    return this.accountPermission.create(obj).map(res => {
      return res;
    });
  }

  getGroupUsers(groupId: string) {
    return this.securityGroupApi.getRegistersUsers(groupId).map(res => {
      return res;
    })
  }

  updateCompanyUser(user) {
    let data = {
      firstName: user.firstName,
      lastName: user.lastName,
      selectedAccounts: user.selectedAccounts,
      password: user.password,
      permissionsToUsers: user.permissionsToUsers
    };
    return this.companyApi
      .updateByIdRegisterUsers(this.profileStore.company.id, user.id, data)
      .map(res => {
        this.companyStore.updateCompanyUser(user.id, res);
      });
  }

  updateSecurityGroup(group) {
    return this.companyApi
      .updateByIdSecurityGroups(this.profileStore.company.id, group.id, group)
      .map(res => {
        this.companyStore.updateGroups(group.id, res);
      });
  }
}
