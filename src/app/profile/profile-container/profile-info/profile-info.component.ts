import { Component, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../../../store/user-profile';
import { MediaAssetConversionUtil } from "./../../../shared/mediaAssetUtil/mediaAssetConversionUtil";
@Component({
  selector: 'profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  
})
export class ProfileInfoComponent {
  @Output() profilePic: EventEmitter<object> = new EventEmitter();


  imageFile: any;
  defaultImage: boolean = false;
  filesToUpload: any

  constructor(
    private userProfile: UserProfile,
    public mediaAssetConversionUtil: MediaAssetConversionUtil) {
  }

  fileRead(event) {
    this.defaultImage = true;
    const mediaObj = { name: '', type: '', src: {} };
    mediaObj.name = event.target.files[0].name;
    mediaObj.type = event.target.files[0].type;
    const reader = new FileReader();
    const imageFileBase64 = { imagename: '', src:'' };
    imageFileBase64.imagename = event.target.files[0].name;
    this.mediaAssetConversionUtil.fileToBase64(event.target.files[0]).then(file => {
      mediaObj.src = file;
      this.imageFile = file;
      this.filesToUpload = event.target.files[0]
    })

  }

  cancel() {
    this.defaultImage = false;
  }

  saveProfileImage() {
    this.profilePic.emit(this.filesToUpload);
    this.defaultImage = false;
  }

}
