import { AllPlatforms } from "./platforms";
import { MyNetworkStatus } from "./myNetworkStatus";

export class SearchModel {
    nameKeyword:string;
    platform: AllPlatforms;
    status:MyNetworkStatus;
    
    constructor() {
        this.nameKeyword='';
        this.platform=null;
        this.status=null;
    }
}