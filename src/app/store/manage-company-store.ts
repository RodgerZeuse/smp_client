import { observable, action } from 'mobx';
import { Injectable } from '@angular/core';
import { CompanyUser } from '../manage-company/user-model';
import { SecurityGroupModel } from '../manage-company/security-group-model';
import { SystemPermissions } from '../shared/sdk';

@Injectable()
export class ManageCompanyStore {
    @observable companyUsers: Array<CompanyUser> = [];
    @observable securityGroups: Array<SecurityGroupModel> = [];
    @observable permissions: Array<SystemPermissions> = [];

    @action setCompanyUsers(users: Array<CompanyUser>) {
        users.forEach(user => {
            if (user.account_type != "company") {
                this.companyUsers.push(user);
            }
        })

    }

    @action addNewCompanyUser(user: CompanyUser) {
        this.companyUsers.push(user);
    }

    @action addNewCompanyGroup(group: SecurityGroupModel) {
        this.securityGroups.push(group);
    }

    @action updateCompanyUser(userId: string, companyUser: CompanyUser) {
        let indexOfEditedUser = this.companyUsers.findIndex(user => user.id == userId);
        this.companyUsers[indexOfEditedUser] = companyUser;
    }

    @action updateGroups(groupId: string, companyGroup: SecurityGroupModel) {
        let indexOfEditedGroup = this.securityGroups.findIndex(group => group.id == groupId);
        this.securityGroups[indexOfEditedGroup] = companyGroup;
    }

    @action setCompanyGroups(groups: Array<SecurityGroupModel>) {
        this.securityGroups = groups;
    }

    @action setPermissions(permissions: Array<SystemPermissions>) {
        this.permissions = permissions;
    }

    @action removeCompanyUsers(userId: string) {
        this.companyUsers.splice((this.companyUsers.indexOf(this.companyUsers.find(user => user.id == userId))), 1);
    }

    @action removeSecurityGroup(groupId: string) {
        this.securityGroups.splice((this.securityGroups.indexOf(this.securityGroups.find(group => group.id == groupId))), 1);
    }
}