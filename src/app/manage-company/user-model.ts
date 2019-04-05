import { SocialAccountForCreate } from "../campaign/shared/components/my-attached-social-networks/model/social-account-for-create.model";

export class CompanyUser {
    firstName: string;
    lastName: string;
    id:string
    email: string;
    password: string;
    account_type: string;
    selectedAccounts: Array<SocialAccountForCreate>;
    permissionsToUsers: Array<string>;
    constructor() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.account_type = '';
        this.selectedAccounts = [];
        this.permissionsToUsers = [];
    }

}