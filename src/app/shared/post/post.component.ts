import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';
import { PostViewModel } from '../../campaign/shared/models/postViewModel';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
@Input() post:PostViewModel;
  icons = require("./../../shared/config/icons.json").icons;
  imageUrl =require("../config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
  constructor() { }

  ngOnInit() {
    console.log(this.post);
     
  }

}
