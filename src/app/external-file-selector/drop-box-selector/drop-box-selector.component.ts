import { Component, OnInit, Output, EventEmitter } from '@angular/core';
declare var Dropbox: any;
import { UserProfile } from "./../../store/user-profile";
import { MediaAssetConversionUtil } from "./../../shared/mediaAssetUtil/mediaAssetConversionUtil";
@Component({
  selector: 'drop-box-selector',
  templateUrl: './drop-box-selector.component.html',
  styleUrls: ['./drop-box-selector.component.css']
})
export class DropBoxSelectorComponent implements OnInit {

  @Output() selectedImage: EventEmitter<Array<File>> = new EventEmitter<Array<File>>();

  constructor(public profileStore: UserProfile,
    public mediaAssetConversionUtil: MediaAssetConversionUtil) { }
  ngOnInit() {
    let button = Dropbox.createChooseButton(this.dropBoxOptions());
    document.getElementById("container-wrapper").appendChild(button);
  }

  dropBoxOptions(): object {

    let filesToEmit: Array<Promise<File>> = Array<Promise<File>>();
    let self = this;
    let options = {
      success: (files) => {
        this.profileStore.loaderStart()
        filesToEmit = []
        for (let i = 0; i < files.length; i++) {
          filesToEmit.push(self.dropboxFileSelection(files[i].link));
        }
        Promise.all(filesToEmit)
          .then(file => {
            self.selectedImage.emit(file);
            this.profileStore.loaderEnd();
          })
      },
      cancel: () => {
      },
      linkType: "direct",
      multiselect: true,
      extensions: ['.png', '.jpeg', '.jpg', '.bmp', '.mp4'],
      folderselect: false,
      sizeLimit: 200000000
    };
    return options;
  }

  dropboxFileSelection(link: string): Promise<File> {
    let res = link.split('/');
    let lastIndex = res.length
    let file = { name: '', src: '', type: '' };
    file.src = link;
    file.name = res[lastIndex - 1];
    file.type = 'image/png';
    return this.mediaAssetConversionUtil.base64ToFile(file).then(file => {
      return file;
    })
    // return fetch(link)
    //   .then(res => res.blob())
    //   .then(blob => {
    //     let file = new File([blob], res[lastIndex - 1], { type: 'image/png' });
    //     return file;
    //   })
  }
}
