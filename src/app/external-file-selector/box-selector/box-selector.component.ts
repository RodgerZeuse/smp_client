import { Component, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { ExternalService } from '../service/external.service';
import { UserProfile } from './../../store/user-profile'
declare var Box: any;
const { FilePicker } = Box;
const filePicker = new FilePicker();
import { MediaAssetConversionUtil } from "./../../shared/mediaAssetUtil/mediaAssetConversionUtil";
@Component({
  selector: 'box-selector',
  templateUrl: './box-selector.component.html',
  styleUrls: ['./box-selector.component.css'],
})
export class BoxSelectorComponent implements OnInit {
  @Output() selectedImage: EventEmitter<any> = new EventEmitter<any>();

  icons: object = {};
  socialConfig: any;
  fileType: string = "";
  clientId: string = "";
  clientSecret: string = "";
  assess_token: string;
  fileUrl: string;
  fileName: string;
  constructor(
    public externalService: ExternalService,
    public profileStore: UserProfile,
    public mediaAssetConversionUtil: MediaAssetConversionUtil) {
  }
  ngOnInit() {
    this.icons = require("./../../shared/config/icons.json").icons;
    this.socialConfig = require("./../../shared/config/socialNetworkConfig.json").socialConfig;

    this.clientId = this.socialConfig.boxClientId;
    this.clientSecret = this.socialConfig.boxClientSecret;
  }

  loadBoxPicker() {
    if (localStorage["userProfile"]) {
      let profile = JSON.parse(localStorage["userProfile"]);
      let access_token = profile.acessToken;

      window.open(this.socialConfig.boxLink + access_token + "", "name", 'width=600,height=400,top=225,left=375');
    }
  }

  getAccessToken(codeToGenerateAccessTocken) {
    this.externalService.getAccessTocken(codeToGenerateAccessTocken).subscribe(res => {
      this.assess_token = res;
      let div = document.getElementById("picker-btn");
      $(".box-div").css({ "visibility": "visible" })
      div.click();
    });
  }

  picker(accessToken) {
    filePicker.show('0', accessToken, {
      container: '.box-net',
      extensions: ['mp4', 'png', 'jpg', 'bmp'],
      maxSelectable: 5
    })

    filePicker.addListener('choose', (items) => {
      this.profileStore.loaderStart();
      items.forEach(item => {
        this.fileName = item.name;
        this.externalService.getFileContentFormBox(item.id, accessToken).subscribe(res => {
          this.fileUrl = res.url;
          if (item.extension == "mp4") {
            this.getVideo();
          }
          else {
            this.getImage();
          }
          $(".box-div").css({ "visibility": "hidden" });
        })
      });
      filePicker.hide();
    });
    filePicker.addListener('cancel', () => {
      $(".box-div").css({ "visibility": "hidden" });
    });
  }

  getImage() {
    let self = this;
    let filesToEmit: Array<Promise<File>> = Array<Promise<File>>();
    this.externalService.getFile(this.fileUrl, this.fileName).subscribe(res => {
      filesToEmit.push(this.fetchImage(res));
      Promise.all(filesToEmit)
        .then(file => {
          self.selectedImage.emit(file);
          this.profileStore.loaderEnd();
        })
    })
  }

  getVideo() {
    let self = this;
    let filesToEmit: Array<Promise<File>> = Array<Promise<File>>();
    this.externalService.getFile(this.fileUrl, this.fileName).subscribe(res => {
      filesToEmit.push(this.fetchVideo(res));
      Promise.all(filesToEmit)
        .then(file => {
          self.selectedImage.emit(file);
          this.profileStore.loaderEnd();
        })
    })
  }

  fetchVideo(url: string) {
    let lastIndex = url.length;
    let file = { name: '', src: '', type: '' };
    file.src = url;
    file.name = url[lastIndex - 1];
    file.type = 'video/mp4';
   return this.mediaAssetConversionUtil.base64ToFile(file).then(file=>{
      return file;
    })
    // return fetch(url)
    //   .then(res => res.blob())
    //   .then(blob => {
    //     let file = new File([blob], url[lastIndex - 1], { type: 'video/mp4' });
        
    //   })
  }

  fetchImage(url: string) {
    let lastIndex = url.length;
    let file = { name: '', src: '', type: '' };
    file.src = url;
    file.name = url[lastIndex - 1];
    file.type = 'image/png';
   return this.mediaAssetConversionUtil.base64ToFile(file).then(file=>{
      return file;
    })
    // return fetch(url)
    //   .then(res => res.blob())
    //   .then(blob => {
    //     let file = new File([blob], url[lastIndex - 1], { type: 'image/png' });
    //     return file;
    //   })
  }

  @HostListener('window:box-auth-complete', ['$event'])
  boxPickerCallBack(event) {
    this.getAccessToken(event.detail);
  }
}