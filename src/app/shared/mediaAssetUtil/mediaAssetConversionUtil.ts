import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { MediaFileAssetViewModel } from '../../campaign/shared/models/mediaFileAssetViewModel';
import { reject } from 'q';

@Injectable({
    providedIn: 'root'
})

export class MediaAssetConversionUtil {
    imagePath: string = '';

    constructor() {
        this.imagePath = require('./../config/urls.json').IMAGE_DOWNLOAD_END_POINT_URL;

    }
    base64ToFile(base64Obj) {
        return fetch(base64Obj.src)
            .then(res => res.blob())
            .then(blob => {
                return new File([blob], base64Obj.name,
                    { type: base64Obj.type && base64Obj.type == 'video/mp4' ? base64Obj.type : 'image/png' });
            })
    }

    async fileToBase64(file: File) {

        return new Promise(

            (resolve, reject) => {
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    //   if (error) reject(error);
                    //   let content = JSON.parse(data);
                    //           let fact = content.value;
                    resolve(e.target.result);
                    // })
                }
                reader.readAsDataURL(file);
            });
    }

    urlToBase64(url:string):Promise<any>{
        return new Promise((resolve,reject)=>{
            let canvas = <HTMLCanvasElement>document.createElement('canvas');
            let context = canvas.getContext("2d");
            canvas.id = "myCan";
            canvas.setAttribute("class", "canvas");
            canvas.height = 200;
            canvas.width = 400;
            let imageUrl;
            let image = new Image();
            image.crossOrigin = "anonymous"
            image.onload = () => {
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                imageUrl = canvas.toDataURL();
                // fileObj.src = imageUrl;
                // console.log("server file", fileObj);
                // // this.base64FilesToShow.push(fileObj);
               
                return resolve(imageUrl)
                //   this.campaignViewModel.mediaFiles.push(newFile);
                //   this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
            }
            image.src = url
        })
       
    }
    serverFileToBase64(serverfile: MediaFileAssetViewModel) {

        // serverfiles.forEach(file => {
        return new Promise<MediaFileAssetViewModel>(
            (resolve, reject) => {

                if (serverfile.type != "video/mp4") {
                    let fileUrl = this.imagePath + serverfile.name;
                    let fileObj: any = {};
                    fileObj.name = serverfile.originalFilename;
                    fileObj.type = serverfile.type;
                    fileObj.tags = serverfile.tags;
                    fileObj.thumbnailName = serverfile.thumbnailName;

                    this.urlToBase64(fileUrl).then(base64Src=>{
                        fileObj.src= base64Src;
                        serverfile.base64File= fileObj;
                        return resolve(serverfile);
                    })
                    // let canvas = <HTMLCanvasElement>document.createElement('canvas');
                    // let context = canvas.getContext("2d");
                    // canvas.id = "myCan";
                    // canvas.setAttribute("class", "canvas");
                    // canvas.height = 200;
                    // canvas.width = 400;
                    // let url;
                    // let image = new Image();
                    // image.crossOrigin = "anonymous"
                    // image.onload = () => {
                    //     context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    //     url = canvas.toDataURL();
                    //     fileObj.src = url;
                    //     console.log("server file", fileObj);
                    //     // this.base64FilesToShow.push(fileObj);
                    //     //   let newFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
                    //     serverfile.base64File = fileObj;
                    //     serverfile.name = serverfile.name;
                    //     serverfile.originalFilename = serverfile.originalFilename;
                    //     serverfile.type = serverfile.type;
                    //     serverfile.id = serverfile.id;
                    //     serverfile.thumbnailName = serverfile.thumbnailName;
                    //     return resolve(serverfile)
                    //     //   this.campaignViewModel.mediaFiles.push(newFile);
                    //     //   this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
                    // }
                    // image.src = fileUrl
                } else {
                    // let newFile: MediaFileAssetViewModel = new MediaFileAssetViewModel();
                    // serverfile.id = serverfile.id;
                    serverfile.serverFile = serverfile;
                    // serverfile.originalFilename = serverfile.originalFilename;
                    // serverfile.name = serverfile.name;
                    // serverfile.type = serverfile.type;
                    // serverfile.thumbnailName = serverfile.thumbnailName;
                    return resolve(serverfile);
                    // this.campaignViewModel.mediaFiles.push(newFile);
                    // this.mediaFilesToShow$.next(this.campaignViewModel.mediaFiles);
                }
                // })



            })

    }
}