import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsContanierComponent } from './comments-contanier.component';

describe('CommentsContanierComponent', () => {
  let component: CommentsContanierComponent;
  let fixture: ComponentFixture<CommentsContanierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsContanierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsContanierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
