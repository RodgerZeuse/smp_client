import { Component, OnInit } from '@angular/core';
import { EditProfile } from '../editProfile-model';
import { ProfileService } from '../profile.service';
import { UserProfile } from '../../store/user-profile';

@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.css']
})
export class ProfileContainerComponent implements OnInit {
 
  constructor(private profileService: ProfileService, private sp:UserProfile) { }
  onUpdate(editProfile: EditProfile) {
    this.profileService.onUpdate(editProfile);

  }
  profilePic(uploadImage) {
    this.profileService.uploadImage(uploadImage).subscribe(data => {
   
    })
  }
  ngOnInit() {
  }

}
