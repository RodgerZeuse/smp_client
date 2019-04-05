import { Observable } from 'rxjs';
import { SocialAccountForCreate } from '../../../shared/components/my-attached-social-networks/model/social-account-for-create.model';
export class CreateCampaignServiceModel{
    title: string;
    description: string;
    mediaFiles: Array<any>;
    state:string;
    scheduledAt:Date;
    selectectedAccountsInfo:Array<SocialAccountForCreate> ;
    hashTags:Array<string>;
    createdAt:Date;
    constructor() {
        this.title = '';
        this.description='';
        this.mediaFiles = [];
        this.state='Draft';
    }

    resetModel(){
        
    }
}
