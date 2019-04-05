import { observable } from "mobx-angular";
export class UserProfileModel {

    @observable id: string;
    @observable username: string;
    @observable email: string;
    @observable role: string;
    @observable token: string;
    @observable accountsAttached: Array<string>;
    @observable audienceCreated: boolean;
    @observable pictureThumbnail: string;
    @observable favouriteUserIds: Array<string>;

    constructor() {
        this.id = '';

    }
}