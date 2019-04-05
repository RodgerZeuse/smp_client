import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ExternalService } from '../service/external.service';
import { UserProfile } from './../../store/user-profile';
import { MediaAssetConversionUtil } from "./../../shared/mediaAssetUtil/mediaAssetConversionUtil";
declare var OneDrive;
@Component({
    selector: 'one-drive-selector',
    templateUrl: './one-drive-selector.component.html',
    styleUrls: ['./one-drive-selector.component.css'],
})

export class OneDriveSelectorComponent implements OnInit {
    icons: object = {};
    socialConfig: any;
    @Output() selectedImage: EventEmitter<any> = new EventEmitter<any>();
    constructor(public externalService: ExternalService,
        public profileStore: UserProfile,
        public mediaAssetConversionUtil: MediaAssetConversionUtil) { }
    ngOnInit() {
        this.icons = require("./../../shared/config/icons.json").icons;
        this.socialConfig = require("./../../shared/config/socialNetworkConfig.json").socialConfig;
    }
    openOneDrive() {
        let oneDriveOptions = {
            clientId: this.socialConfig.oneDriveClienId,
            action: "download",
            multiSelect: true,
            advanced: {
                endpointHint: this.socialConfig.oneDriveEndPointHint,
                filter: '.mp4,.png,.jpg,.jpeg,.bmp'
            },
            success: (files) => {
                this.getFilesToDownlaod(files)
            },
            cancel: () => { },
            error: (e) => { }
        }
        OneDrive.open(oneDriveOptions);
    }

    getFilesToDownlaod(files: any) {
        this.profileStore.loaderStart();
        files.value.forEach(file => {
            let fileUrl = file["@content.downloadUrl"];
            let fileName = file.name;
            let format = file.name.split(".")[1];
            if (format == "mp4") {
                this.getVideo(fileUrl, fileName);
            }
            else {
                this.getImage(fileUrl, fileName);
            }
        });
    }

    getImage(url: string, name: string) {
        let self = this;
        let filesToEmit: Array<Promise<File>> = Array<Promise<File>>();
        this.externalService.getFile(url, name).subscribe(res => {
            filesToEmit.push(this.fetchImage(res, name));
            Promise.all(filesToEmit)
                .then(file => {
                    self.selectedImage.emit(file);
                    this.profileStore.loaderEnd();
                })
        })
    }

    getVideo(url: string, name: string) {
        let self = this;
        let filesToEmit: Array<Promise<File>> = Array<Promise<File>>();
        this.externalService.getFile(url, name).subscribe(res => {
            filesToEmit.push(this.fetchVideo(res, name));
            Promise.all(filesToEmit)
                .then(file => {
                    self.selectedImage.emit(file);
                    this.profileStore.loaderEnd();
                })
        })
    }

    fetchVideo(url: string, name) {
        let file = { name: '', src: '', type: '' };
        file.src = url;
        file.name = url;
        file.type = 'video/mp4';
        return this.mediaAssetConversionUtil.base64ToFile(file).then(file => {
            return file;
        })
        // return fetch(url)
        //     .then(res => res.blob())
        //     .then(blob => {
        //         let file = new File([blob], name, { type: 'video/mp4' });
        //         return file;
        //     })
    }

    fetchImage(url: string, name: string) {
        let file = { name: '', src: '', type: '' };
        file.src = url;
        file.name = url;
        file.type = 'image/png';
        return this.mediaAssetConversionUtil.base64ToFile(file).then(file => {
            return file;
        })
        // return fetch(url)
        //     .then(res => res.blob())
        //     .then(blob => {
        //         let file = new File([blob], name, { type: 'image/png' });
        //         return file;
        //     })
    }
}
