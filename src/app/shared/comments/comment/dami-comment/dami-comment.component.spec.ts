import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamiCommentComponent } from './dami-comment.component';

describe('DamiCommentComponent', () => {
  let component: DamiCommentComponent;
  let fixture: ComponentFixture<DamiCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamiCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamiCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
