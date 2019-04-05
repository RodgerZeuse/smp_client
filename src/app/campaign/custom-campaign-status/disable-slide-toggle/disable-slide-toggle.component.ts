import { Component, Input } from '@angular/core';

@Component({
  selector: 'disable-slide-toggle',
  templateUrl: './disable-slide-toggle.component.html',
  styleUrls: ['./disable-slide-toggle.component.css']
})

export class DisableSlideToggleComponent {
  @Input() toggleValue: any;
  toggle: boolean = false;
}
