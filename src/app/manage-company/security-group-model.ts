import { RegisterUser } from "../shared/sdk";

export class SecurityGroupModel {
    id: string;
    name: string;
    registerUsers: Array<RegisterUser>;
    systemsPermissions: Array<string>;
    constructor() {
        this.name = '';
        this.systemsPermissions = [];
        this.registerUsers = [];
    }
}