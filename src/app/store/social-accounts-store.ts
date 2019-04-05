import { observable, action, computed } from 'mobx';
import { Injectable } from "@angular/core";
import { SocialMediaAccount } from '../shared/sdk/models';
import * as _ from "lodash";
import { SearchModel } from '../shared/model/searchModel';

@Injectable()
export class SocialAccountsStore {
    @observable socialAccounts: Array<SocialMediaAccount> = new Array<SocialMediaAccount>();
    @observable allSocialAccounts: Array<SocialMediaAccount> = new Array<SocialMediaAccount>();
    @observable dirty: boolean;
    @observable searchData: SearchModel;
    @observable lastSearchFilter: SearchModel;

    @action reset = () => {
        this.socialAccounts = [];
        this.searchData = new SearchModel();
        this.lastSearchFilter = new SearchModel();
    }

    @action updateLinkedAccount(updatedAccount: SocialMediaAccount) {
        let foundAccount = this.socialAccounts.findIndex(x => x.id == updatedAccount.id);
        if (foundAccount > -1) {
            this.socialAccounts[foundAccount].linked = updatedAccount.linked;
            this.allSocialAccounts[foundAccount].linked = updatedAccount.linked;
        }
    }

    @action searchFilter(searchFilter: SearchModel) {
        this.searchData = searchFilter;
    }

    @action deleteSocialNetwork(accountId) {
        this.socialAccounts.splice((this.socialAccounts.indexOf(this.socialAccounts.find(account => account.id == accountId))), 1);
        this.allSocialAccounts.slice((this.allSocialAccounts.indexOf(this.allSocialAccounts.find(account => account.id == accountId))), 1)
    }

    @action activateAccount(accountId) {
        for (let i = 0; i < this.socialAccounts.length; i++) {
            if (this.socialAccounts[i].id == accountId) {
                this.socialAccounts[i].isActive = true;
                this.allSocialAccounts[i].isActive = true;
            }
        }
    }

    @action deActivateAccount(accountId) {
        for (let i = 0; i < this.socialAccounts.length; i++) {
            if (this.socialAccounts[i].id == accountId) {
                this.socialAccounts[i].isActive = false;
                this.allSocialAccounts[i].isActive = false;
            }
        }
    }

    @action saveSocialNetwork(socialAccounts) {
        this.socialAccounts = socialAccounts;
        this.allSocialAccounts = socialAccounts;
    }

    @action saveSocialNetworks(socialAccount) {
        this.socialAccounts.push(socialAccount);
    }

    @computed get ConnectedAccounts() {
        return this.socialAccounts.filter(item => item.status == "connected")
    }

    @computed get searchAccontsByUserName() {
        if (this.searchData) {
            this.lastSearchFilter = this.searchData;
            let filterAccounts: Array<SocialMediaAccount> = [];
            if (this.searchData.status && this.searchData.status.disconnected) {
                if (this.searchData.status.disconnected == true && this.searchData.nameKeyword.length == 0 && this.searchData.platform.facebook == false && this.searchData.platform.instagram == false && this.searchData.platform.youtube == false) {
                    this.socialAccounts.filter(
                        item => {
                            if (item.status.indexOf("disconnect") > -1) {
                                filterAccounts.push(item);
                            }
                        })
                }
                else if (this.searchData.status.disconnected == true && this.searchData.nameKeyword.length > 0 && this.searchData.platform.facebook == false && this.searchData.platform.instagram == false && this.searchData.platform.youtube == false) {
                    this.socialAccounts.filter(
                        item => {
                            if (item.status.indexOf("disconnect") > -1) {
                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) { filterAccounts.push(item); }
                            }
                        });
                }
                else if (this.searchData.status.disconnected == true && this.searchData.nameKeyword.length > 0 && (this.searchData.platform.facebook == true || this.searchData.platform.instagram == true || this.searchData.platform.youtube == true)) {
                    if (this.searchData.platform.facebook) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("disconnect") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("FB") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.instagram) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("disconnect") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("IG") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.youtube) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("disconnect") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("YT") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                }
                else if (this.searchData.status.disconnected == true && this.searchData.nameKeyword.length == 0 && (this.searchData.platform.facebook == true || this.searchData.platform.instagram == true || this.searchData.platform.youtube == true)) {
                    if (this.searchData.platform.facebook) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("disconnect") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("FB") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.instagram) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("disconnect") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("IG") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.youtube) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("disconnect") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("YT") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                }
            }
            if (this.searchData.status && this.searchData.status.connected) {
                if (this.searchData.status.connected == true && this.searchData.nameKeyword.length == 0 && this.searchData.platform.facebook == false && this.searchData.platform.instagram == false && this.searchData.platform.youtube == false) {
                    this.socialAccounts.filter(
                        item => {
                            if (item.status.indexOf("connected") > -1) {
                                filterAccounts.push(item)
                            }
                        })
                }
                else if (this.searchData.status && this.searchData.status.connected == true && this.searchData.nameKeyword.length > 0 && this.searchData.platform.facebook == false && this.searchData.platform.instagram == false && this.searchData.platform.youtube == false) {
                    this.socialAccounts.filter(
                        item => {
                            if (item.status.indexOf("connected") > -1) {
                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) { filterAccounts.push(item); }
                            }
                        });
                }
                else if (this.searchData.status && this.searchData.status.connected == true && this.searchData.nameKeyword.length > 0 && (this.searchData.platform.facebook == true || this.searchData.platform.instagram == true || this.searchData.platform.youtube == true)) {
                    if (this.searchData.platform.facebook) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("connected") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("FB") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.instagram) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("connected") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("IG") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.youtube) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("connected") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("YT") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                }
                else if (this.searchData.status && this.searchData.status.connected == true && this.searchData.nameKeyword.length == 0 && (this.searchData.platform.facebook == true || this.searchData.platform.instagram == true || this.searchData.platform.youtube == true)) {
                    if (this.searchData.platform.facebook) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("connected") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("FB") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.instagram) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("connected") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("IG") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                    if (this.searchData.platform.youtube) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.status.indexOf("connected") > -1) {
                                    if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                        if (item.type.indexOf("YT") > -1)
                                            filterAccounts.push(item);
                                    }
                                }
                            });
                    }
                }
            }
            else {
                if (this.searchData.status && this.searchData.status.any == true && this.searchData.nameKeyword.length == 0 && this.searchData.platform.facebook == false && this.searchData.platform.instagram == false && this.searchData.platform.youtube == false) {
                    this.socialAccounts.filter(
                        item => {
                            {
                                filterAccounts.push(item)
                            }
                        })
                }
                else if (this.searchData.status && this.searchData.status.any == true && this.searchData.nameKeyword.length > 0 && this.searchData.platform.facebook == false && this.searchData.platform.instagram == false && this.searchData.platform.youtube == false) {
                    this.socialAccounts.filter(
                        item => {

                            if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) { filterAccounts.push(item); }
                        });
                }
                else if (this.searchData.status && this.searchData.status.any == true && this.searchData.nameKeyword.length > 0 && (this.searchData.platform.facebook == true || this.searchData.platform.instagram == true || this.searchData.platform.youtube == true)) {
                    if (this.searchData.platform.facebook) {
                        this.socialAccounts.filter(
                            item => {

                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                    if (item.type.indexOf("FB") > -1)
                                        filterAccounts.push(item);
                                }
                            });
                    }
                    if (this.searchData.platform.instagram) {
                        this.socialAccounts.filter(
                            item => {

                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                    if (item.type.indexOf("IG") > -1)
                                        filterAccounts.push(item);
                                }
                            });
                    }
                    if (this.searchData.platform.youtube) {
                        this.socialAccounts.filter(
                            item => {

                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                    if (item.type.indexOf("YT") > -1)
                                        filterAccounts.push(item);
                                }
                            });
                    }
                }
                else if (this.searchData.status && this.searchData.status.any == true && this.searchData.nameKeyword.length == 0 && (this.searchData.platform.facebook == true || this.searchData.platform.instagram == true || this.searchData.platform.youtube == true)) {
                    if (this.searchData.platform.facebook) {
                        this.socialAccounts.filter(
                            item => {

                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                    if (item.type.indexOf("FB") > -1)
                                        filterAccounts.push(item);
                                }
                            });
                    }
                    if (this.searchData.platform.instagram) {
                        this.socialAccounts.filter(
                            item => {
                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                    if (item.type.indexOf("IG") > -1)
                                        filterAccounts.push(item);
                                }
                            });
                    }
                    if (this.searchData.platform.youtube) {
                        this.socialAccounts.filter(
                            item => {

                                if (item.userName.toLowerCase().indexOf(this.searchData.nameKeyword.toLowerCase()) > -1) {
                                    if (item.type.indexOf("YT") > -1)
                                        filterAccounts.push(item);
                                }
                            });
                    }
                }
            }
            return filterAccounts;

        }
        else {
            return this.socialAccounts
        }
    }

    @action updateNetwroks() {
        this.dirty = !this.dirty;
    }
}