import { Observable, empty, BehaviorSubject } from 'rxjs';
import { MediaFileAssetViewModel } from './../../../models/mediaFileAssetViewModel';

export class CampaignDefinitionViewModel {
    currentDate: Date;
    title: string;
    description: string;
    mediaFiles: Array<MediaFileAssetViewModel>;
    state:string;
    scheduledAt:Date;
    createdAt:Date;
    registerUserId:string;
    campaignId:string;
    dateTime: Date;
    filesToUpload: Array<any> = [];
    fileUploadingLimitError = '';
    imageIndex: number;
    type:string;
    // selectedFbPage:object;
    // selectedIgPage:object;
    selectedAccountAndPageInfo:Array<any>;
    // fbAccountAndPageInfo: object;
    // igAccountAndPageInfo: object;
    panelOpenState: boolean = true;
    // hashtagSelectable = true;
    // hashtagRemovable = true;
    // hashtags:Array<string> = [];
    createButtonstate:string;
    videoFileName: string;
    isDescription: boolean;
  isTitle: boolean;
//   createCampaignstate: Array<string> = ['Save as draft', 'Post Now', 'Schedule', 'Add To Queue'];
 
    constructor() {
        this.isTitle = true;
        this.isDescription = true;
        this.title = '';
        this.description='';
        this.createButtonstate = 'Save as draft';
        this.type='';
        // this.hashtags=[];
        this.filesToUpload=[];
        this.selectedAccountAndPageInfo=[];
        this.videoFileName='';
        // this.namesToEditMediaFiles=[];
        this.currentDate=new Date();
    }
}