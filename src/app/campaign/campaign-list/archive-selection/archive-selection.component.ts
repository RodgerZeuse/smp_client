import { EventEmitter, Component, Output, Input } from '@angular/core';
import { UserProfile } from 'src/app/store/user-profile';


@Component({
  selector: 'archive-selection',
  templateUrl: './archive-selection.component.html',
  styleUrls: ['./archive-selection.component.css']
})

export class ArchiveSelectionComponent {
  @Output() onSelectAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onConfirmArchive: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isAllowSelection: boolean;
  @Output() onAllowOrCancelSelection: EventEmitter<boolean> = new EventEmitter<boolean>();

  groupRights = require("../../../shared/config/group-rights.json").groupRights;

  constructor(private profileStore: UserProfile) { }

  allowSelection() {
    this.isAllowSelection = !this.isAllowSelection;
    this.onAllowOrCancelSelection.emit(this.isAllowSelection);
  }

  selectAll() {
    this.onSelectAll.emit(true);
  }
  
  onConfirmArchiveMove() {
    this.onConfirmArchive.emit(true);
  }

}
