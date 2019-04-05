import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'add-networks',
  templateUrl: './add-networks.component.html',
  styleUrls: ['./add-networks.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNetworksComponent {
  @Output() isUpdateList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() networkInfo: EventEmitter<object> = new EventEmitter<object>();
  @Output() onActiveLoader: EventEmitter<boolean> = new EventEmitter();

  updateAccountsList(event) {
    this.isUpdateList.emit(true);
  }

  activeLoader(event) {
    this.onActiveLoader.emit(event)
  }

  networkInfor(network: object) {
    this.networkInfo.emit(network);
  }
}
