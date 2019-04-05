import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from "lodash";
import { PostViewModel } from './../../models/postViewModel';
@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PostPreviewComponent implements OnInit {
  imagePath = require('./../../../../shared/config/urls.json').IMAGE_DOWNLOAD_END_POINT_URL;
  icons = require('./../../../../shared/config/icons.json').icons;
  @Input() postViewModel: Observable<PostViewModel>;
  // uniquPlatforms: Array<any> = [];

  constructor() { }

  ngOnInit() {
   
    // this.postViewModel.subscribe(posts => {
    //   this.uniquPlatforms = _.uniqBy(posts, 'network');
      console.log('postsArray-component', this.postViewModel);
    // })
  }
  
}
