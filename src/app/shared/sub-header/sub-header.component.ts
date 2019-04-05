import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css']
})
export class SubHeaderComponent implements OnInit {
  isSearch:boolean;
  constructor() { 
    this.isSearch = false;
  }

  ngOnInit() {
  }
  openSearchBox(){
    this.isSearch = !this.isSearch;
  }
}
