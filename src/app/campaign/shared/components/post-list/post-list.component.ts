import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { PostViewModel } from '../../models/postViewModel';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PostListComponent implements OnInit {
@Input() posts$: Observable<Array<PostViewModel>>
  constructor() { }

  ngOnInit() {
 this.posts$.subscribe(posts => {
      // this.uniquPlatforms = _.uniqBy(posts, 'network');
      console.log('postsArray', posts);
    })
  }

}
