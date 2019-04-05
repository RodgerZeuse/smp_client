import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Campaign, MediaFileAssetInterface } from './../../../shared/sdk';
import { UUID } from 'angular2-uuid';
import { MediaFileAssetViewModel } from '../models/mediaFileAssetViewModel';
// import { MediaAssetUtil } from "./../../../shared/mediaAssetUtil/mediaAssetUtil";
@Injectable({
    providedIn: 'root',
})
export class CampaignDefinitionService {

    constructor() {
        // currentDate: Date;
        // title: string;
        // description: string;
        // mediaFiles: Array<ViewMediaFiles>;
        // status:string;
        // scheduledAt:Date;
        // createdAt:Date;
        // registerUserId:string;
        // campaignId:string;
    }
    getViewmodel(serverModelCampaign: Campaign) {
        let campaign = Object.assign(serverModelCampaign, {});
        // campaign.posts.forEach(file => {

        // })

    }
    async serverFileRead(files) {
        // let totalMediaFiles = this.campaignViewModel.mediaFiles.length + files.length;
        // if (this.campaignViewModel.mediaFiles.length > 5 || files.lenght > 5 || totalMediaFiles > 5) {
        //   this.errorForForm(errors.errors.mediaFilesMaxError);
        // } else {
        //   if (files.length <= 5) {
        let newMediaFiles: Array<MediaFileAssetViewModel> = [];
        for (let i = 0; i < files.length; i++) {

            Object.defineProperty(files[i], 'name', {
                writable: true,
                value: UUID.UUID() + files[i].name
            });

            const reader = new FileReader();
            let newFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
            newFile.name = files[i].name;
            newFile.base64File.name = files[i].name;
            // this.mediaAssetUtil.fileToBase64(files[i]).then(res => {
            //     newFile.base64File.src = res;
            //     newFile.base64File.type = files[i].type;
            //     newFile.file = files[i];
            //     newFile.type = files[i].type;
            //     return newMediaFiles.push(newFile);
            //     // this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
            // }).catch(
            //     error => { return error }
            // )
        }
    }
    //       }
    //     }
    //   }
}