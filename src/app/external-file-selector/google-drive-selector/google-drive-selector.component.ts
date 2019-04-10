import { Component, EventEmitter, Output, OnInit } from "@angular/core";
// declare var gapi: any;
declare var google: any;
import { UserProfile } from "./../../store/user-profile";
@Component({
  selector: "google-drive-selector",
  templateUrl: "./google-drive-selector.component.html",
  styleUrls: ["./google-drive-selector.component.css"]
})
export class GoogleDriveSelectorComponent implements OnInit {
  socialConfig: any;
  icons: object = {};
  constructor(public profileStore: UserProfile) {}

  ngOnInit() {
    this.icons = require("./../../shared/config/icons.json").icons;
    this.socialConfig = require("./../../shared/config/socialNetworkConfig.json").socialConfig;
    this.developerKey = this.socialConfig.googleDriveDeveloperKey;
    this.clientId = this.socialConfig.googleDriveClientId;
    this.appId = this.socialConfig.googleDriveAppId;
    this.scope = ["profile", "email", this.socialConfig.googleDriveLink].join(
      " "
    );
    this.pickerApiLoaded = false;
  }
  developerKey: string;
  clientId: string;
  appId: string;
  scope: any;
  pickerApiLoaded: boolean;
  @Output() selectedImage: EventEmitter<any> = new EventEmitter<any>();

  oauthToken?: any;
  filePath: string = "";

  // loadGoogleDrive() {
  //   gapi.load('auth', { 'callback': this.onAuthApiLoad.bind(this) });
  //   gapi.load('picker', { 'callback': this.onPickerApiLoad.bind(this) });
  // }

  // onAuthApiLoad() {
  //   gapi.auth.authorize(
  //     {
  //       'client_id': this.clientId,
  //       'scope': this.scope,
  //       'immediate': false
  //     },
  //     this.handleAuthResult);
  // }

  onPickerApiLoad() {
    this.pickerApiLoaded = true;
  }

  // handleAuthResult = (authResult) => {
  //   let _self = this;
  //   if (authResult && !authResult.error) {
  //     if (authResult.access_token) {
  //       let view = new google.picker.View(google.picker.ViewId.DOCS);
  //       view.setMimeTypes("image/png,image/jpeg,image/jpg,video/mp4");
  //       let picker = new google.picker.PickerBuilder().
  //         enableFeature(google.picker.Feature.NAV_HIDDEN).
  //         enableFeature(google.picker.Feature.MULTISELECT_ENABLED).
  //         setOAuthToken(authResult.access_token).
  //         addView(view).
  //         setCallback((e) => {
  //           _self.selectImages(e);
  //         }
  //         ).
  //         build();
  //       picker.setVisible(true);
  //     }
  //   }
  // }

  // selectImages(e) {
  //   this.profileStore.loaderStart();
  //   let _self = this;
  //   let resp: string
  //   if (e[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
  //     let index: number = e[google.picker.Response.DOCUMENTS].length;
  //     for (let i = 0; i < index; i++) {
  //       let doc = e[google.picker.Response.DOCUMENTS][i];
  //       gapi.client.load('drive', 'v2', function () {
  //         let file = gapi.client.drive.files.get({ 'fileId': doc.id });
  //         file.execute((res) => {
  //           resp = res.thumbnailLink.substr(0, res.thumbnailLink.lastIndexOf("="));
  //           _self.drawOnCanwas(resp)
  //         });
  //       })
  //     }
  //   }
  // }

  drawOnCanwas(fileUrl: string) {
    let canvas = <HTMLCanvasElement>document.createElement("canvas");
    let context = canvas.getContext("2d");
    canvas.id = "myCan";
    canvas.setAttribute("class", "canvas");
    canvas.height = 200;
    canvas.width = 400;
    let url;
    let image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      url = canvas.toDataURL();
      this.showImages(url);
    };
    image.src = fileUrl;
  }

  showImages(url) {
    let self = this;
    let filesToEmit: Array<Promise<File>> = Array<Promise<File>>();
    let file: Promise<File> = this.convertToFile(url);
    filesToEmit.push(file);
    Promise.all(filesToEmit).then(file => {
      self.selectedImage.emit(file);
      self.profileStore.loaderEnd();
    });
  }

  convertToFile(url): Promise<File> {
    return fetch(url, { mode: "no-cors" })
      .then(res => res.blob())
      .then(blob => {
        let file = new File([blob], "test", { type: "image/png" });
        return file;
      });
  }
}
