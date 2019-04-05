import { Observable, empty, BehaviorSubject } from 'rxjs';
import { MediaFileAsset } from '../../../shared/sdk/models/MediaFileAsset';
import { Tag } from '../../../shared/sdk/models/Tag';
import { TagViewModel } from './tagViewModel';

export class MediaFileAssetViewModel {
    name: string;
    originalFilename: string;
    type: string;
    base64File: any = {};
    isCropped: boolean;
    thumbnailFile: MediaFileAssetViewModel;
    thumbnailName: string;
    videoFile: File;
    id: string;
    serverFile: any;
    croppedImages: Array<MediaFileAssetViewModel> = [];
    network: string;
    tags: Array<any>;
    isPersist: boolean;
    isEdited: boolean;
    file: File;

    toServerModel() {
        let file: MediaFileAsset = new MediaFileAsset();

        file.id = this.id;
        file.isCropped = this.isCropped;
        file.name = this.name;
        file.network = this.network;
        file.originalFilename = this.originalFilename;
        file.tags = this.tags;
        file.thumbnail = this.thumbnailName;
        file.type = this.type;

        return file;


    }
    populateFromServerModel(file: MediaFileAsset) {


        // let croppedFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
        this.name = file.name;
        this.originalFilename = file.originalFilename;
        this.thumbnailName = file.thumbnail;
        this.network = file.network;
        this.isCropped = file.isCropped;
        if (file.tags) {
            this.tags = file.tags.map(x => Object.assign({}, x));
        }

        this.type = file.type;
        this.id = file.id;
    }
}