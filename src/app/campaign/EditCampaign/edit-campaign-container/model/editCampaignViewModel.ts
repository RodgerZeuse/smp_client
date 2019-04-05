import { Post } from './../../../../shared/sdk'
import { BehaviorSubject } from "rxjs";
export class EditCampaignViewModel {

    
    isAccountSelected: boolean;
    newMediaFiles: boolean;
    id: string;
    arrayOfNewImagesObject: Array<any>;
    postsToRemove: Array<string>;
    toRemovePictures: Array<string>;
    imagePath: any;
    allThumbnails: Array<File>;
    // variables for image posts details to show on tiles start ----
    postsArrayToShow: Array<Post>;
    postsArrayToShow$ = new BehaviorSubject(this.postsArrayToShow);
    originalFilesToShow: Array<any>;
    croppedImagesToShow: Array<any> = [];
    // variables for image posts details to show on tiles end -----
    constructor() {
        this.originalFilesToShow = [];
        this.postsArrayToShow = []
        this.allThumbnails = [];
        this.isAccountSelected = false;
        this.newMediaFiles = false;
        this.id = '';
        this.arrayOfNewImagesObject = [];
        this.postsToRemove = [];
        this.toRemovePictures = [];
    }
}