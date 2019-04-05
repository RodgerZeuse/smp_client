import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'box-popup-opener',
  templateUrl: './box-popup-opener.component.html',
  styleUrls: ['./box-popup-opener.component.css']
})
export class BoxPopupOpenerComponent implements OnInit {

  codeToGenerateAccessTocken: string;
  ngOnInit() {
    let pageURL = window.location.href;
    this.codeToGenerateAccessTocken = pageURL.split('=')[1];
    opener.dispatchEvent(new CustomEvent('box-auth-complete', { detail: this.codeToGenerateAccessTocken }));
    if (this.codeToGenerateAccessTocken != "") {
      window.close();
    }
  }

}
