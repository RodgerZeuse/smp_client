import { observable, action, computed, autorun } from 'mobx';
import { Injectable } from '@angular/core';
import { UserProfileModel } from "../membership/Sign-In/user/user-profile-model";
import { SearchModel } from '../shared/model/searchModel';
import * as _ from "lodash";
import { User, SecurityGroup, Company, SystemPermissions } from '../shared/sdk';
import { CompanyUser } from '../manage-company/user-model';

@Injectable()
export class UserProfile {
    @observable icons: any;
    @observable loader: boolean = false;
    @observable userEmail: string;
    @observable userAccountType: string;
    @observable acessToken: string;
    @observable userId: string;
    @observable userProfileData: UserProfileModel;
    @observable isLogin: boolean;
    @observable firstName: string;
    @observable lastName: string;
    @observable companyName: string;
    @observable profileImage: string = '';
    @observable lastSearchFilter: SearchModel;
    @observable searchData: SearchModel;
    @observable UserAccountsDetails: Array<User> = [];
    @observable fb: boolean;
    @observable ig: boolean;
    @observable yt: boolean;
    @observable pi: boolean;
    @observable tw: boolean;
    @observable createCampaign: boolean;
    @observable isCampaignCreate: boolean;
    @observable downloadImagePath: string = require("./../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
    @observable selectedAccounts: Array<any> = [];
    @observable campaignDataSave: boolean;
    @observable companyUser: CompanyUser;
    @observable company: Company = new Company();
    @observable securityGroups: Array<SecurityGroup> = [];
    @observable userRights: Array<SystemPermissions> = [];

    constructor() {
        this.icons = require("./../shared/config/icons.json").icons;
        autorun(() => {
            if (localStorage["userProfile"]) {
                let obj = JSON.parse(localStorage["userProfile"]);
                this.firstName = obj.firstName;
                this.lastName = obj.lastName;
                this.userEmail = obj.userEmail;
                this.userAccountType = obj.userAccountType;
                this.acessToken = obj.acessToken;
                this.userId = obj.userId;
                this.isLogin = true;
                this.profileImage = obj.profileImage;
                this.companyName = obj.companyName;
                this.pi = obj.pi;
                this.ig = obj.ig;
                this.tw = obj.tw;
                this.fb = obj.fb;
                this.yt = obj.yt;
                this.createCampaign = obj.createCampaign;
                this.company = obj.company;
                this.companyUser = obj.companyUser
                this.userRights = obj.userRights;
            }
        });
    }

    @action loaderStart() {
        this.loader = true;
        console.log("Loader Start");
    }
    @action loaderEnd() {
        this.loader = false;
        console.log("Loader End");
    }

    @action saveAccessToken_userID(token, userId) {
        this.acessToken = token;
        this.userId = userId;
    }

    @action updateProfile(editData) {
        this.firstName = editData.firstName;
        this.lastName = editData.lastName;
        this.userEmail = editData.email;
        this.companyName = editData.companyName;
        let obj = {
            firstName: editData.firstName,
            lastName: editData.lastName,
            userEmail: this.userEmail,
            userAccountType: editData.account_type,
            acessToken: this.acessToken,
            userId: editData.id,
            profileImage: this.profileImage,
            companyName: this.companyName,
            company: this.company,
            companyUser: this.companyUser
        }
        window.localStorage["userProfile"] = JSON.stringify(obj);
    }

    @action profilePic(imageUrl) {
        this.profileImage = this.downloadImagePath + imageUrl;
        let obj = {
            firstName: this.firstName,
            lastName: this.lastName,
            userEmail: this.userEmail,
            userAccountType: this.userAccountType,
            acessToken: this.acessToken,
            userId: this.userId,
            profileImage: this.profileImage
        }
        window.localStorage["userProfile"] = JSON.stringify(obj);
    }

    @action teamMemberAccountsDetail(userData) {
        this.UserAccountsDetails = userData;
    }

    @action saveUserDateInLocalStorage(userData?, token?) {
        this.ig = true;
        this.fb = true;
        this.yt = true;
        this.pi = true;
        this.tw = true;
        this.createCampaign = true;
        this.firstName = userData.firstName;
        this.userAccountType = userData.account_type;
        this.lastName = userData.lastName;
        this.userEmail = userData.email;
        this.companyName = userData.companyName;
        if (userData.companyUser) {
            this.companyUser = userData.companyUser;
        }

        if (userData.securityGroups) {
            this.securityGroups = userData.securityGroups;
        }

        if (userData.profileImage == null) {
            this.profileImage = this.icons.avatarIcon;
        } else {
            this.profileImage = this.downloadImagePath + userData.profileImage;
        }

        if (userData.companyId) {
            if (!this.company) {
                this.company = new Company();
            }
            this.company.id = userData.companyId;
        }

        if (userData.myCompany) {
            this.company = userData.myCompany;
        }

        let obj = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            userEmail: userData.email,
            userAccountType: this.userAccountType,
            acessToken: this.acessToken,
            userId: this.userId,
            profileImage: this.profileImage,
            companyName: userData.companyName,
            currentUserData: token,
            fb: this.fb,
            ig: this.ig,
            yt: this.yt,
            tw: this.tw,
            pi: this.pi,
            company: this.company,
            companyUser: this.companyUser,
            createCampaign: this.createCampaign,
            securityGroups: this.securityGroups
        }
        window.localStorage["userProfile"] = JSON.stringify(obj);
    }

    @action setUserRights(rights: Array<SystemPermissions>) {
        if (localStorage["userProfile"]) {
            let obj = JSON.parse(localStorage["userProfile"]);
            this.userRights = rights;
            obj.userRights = rights;
            window.localStorage["userProfile"] = JSON.stringify(obj);
        }
    }

    @action haveAccess(keyToCheck: string): boolean {
        if (this.userRights) {
            let indexFound = this.userRights.findIndex(userRight => userRight.key == keyToCheck)
            if (indexFound > -1) {
                return true;
            } else {
                return false;
            }
        }
    }

    @action saveEmail_accounType(email, accountType) {
        this.userEmail = email;
        this.userAccountType = accountType;
    }

    @action setCompany(company: Company) {
        if (localStorage["userProfile"]) {
            let obj = JSON.parse(localStorage["userProfile"]);
            this.company = company;
            obj.company = company;
            window.localStorage["userProfile"] = JSON.stringify(obj);
        }
    }

    @action reset = () => {
        this.userEmail = '';
        this.userAccountType = '';
        this.acessToken = '';
        this.userId = '';
        this.userProfileData;
        this.firstName = '';
        this.lastName = '';
        this.companyName = '';
        this.profileImage = '';
        this.lastSearchFilter = new SearchModel();
        this.searchData = new SearchModel();
        this.UserAccountsDetails = [];
        this.downloadImagePath = ''
        this.selectedAccounts = [];
        this.companyUser = new CompanyUser();
        this.company = new Company();
        this.securityGroups = [];
        this.userRights = [];
    }

    @computed get profilePicture() {
        return this.profileImage;
    }

}