import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { NetworkInfoViewModal } from '../modal/network-info-view-modal';
import { PlatformLocation } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-social-media-details-selecter',
  templateUrl: './social-media-details-selecter.component.html',
  styleUrls: ['./social-media-details-selecter.component.css']
})

export class SocialMediaDetailsSelecterComponent  {
  onUpdataPages = new EventEmitter<Object>();
  onDeleteAccount = new EventEmitter<string>();
  accountId: string = "";
  network: any;
  dataNotSelected: boolean;
  viewPages: Array<NetworkInfoViewModal> = [];
  viewGroups: Array<NetworkInfoViewModal> = [];
  viewBoards: Array<NetworkInfoViewModal> = [];
  youtubeChannels: Array<NetworkInfoViewModal> = [];
  platform: string;

  dataToUpdate = {
    selectedPages: [],
    selectedGroups: [],
    selectedBoards: [],
    selectedChannels: []
  }

  constructor(public dialogRef: MatDialogRef<SocialMediaDetailsSelecterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, location: PlatformLocation) {
    this.network = data;
    console.log("In popup", this.network);
    location.onPopState(() => {
      this.deleteAccount();
    });

    this.dataNotSelected = false;
    this.accountId = this.network.accountId;
    if (this.network) {
      if (this.network.type === "YT") {
        this.platform = this.network.type;
        this.youtubeChannels = this.network.channelsList;
        this.accountId = this.network.id;
      }
      else {
        this.viewPages = [];
        this.viewBoards = [];
        this.viewGroups = [];
        if (this.network.smPages && this.network.smPages.length > 0) {
          this.network.smPages.forEach(smPage => {
            let page = smPage//Object.assign({}, smPage);
            page.id = smPage.id;
            page.name = smPage.name;
            page.isSelected = false;
            this.viewPages.push(page);
          });

        }

        if (this.network.smGroups && this.network.smGroups.length > 0) {
          this.network.smGroups.forEach(smGroup => {
            let group = smGroup//Object.assign({}, smGroup);
            group.id = smGroup.id;
            group.name = smGroup.name;
            group.isSelected = false;
            this.viewGroups.push(group);
          });
        }

        if (this.network.boards && this.network.boards.data.length > 0) {
          this.network.boards.data.forEach(smBoard => {
            let board = smBoard//Object.assign({}, smBoard);
            board.id = smBoard.id;
            board.name = smBoard.name;
            board.isSelected = false;
            this.viewBoards.push(board);
          });
        }
      }
    }
  }

  // ngOnInit() {

  //   this.dataNotSelected = false;
  //   this.accountId = this.network.accountId;
  //   if (this.network) {
  //     if (this.network.type === "YT") {
  //       this.platform = this.network.type;
  //       this.youtubeChannels = this.network.channelsList;
  //       this.accountId = this.network.id;
  //     }
  //     else {
  //       this.viewPages = [];
  //       this.viewBoards = [];
  //       this.viewGroups = [];
  //       if (this.network.smPages && this.network.smPages.length > 0) {
  //         this.network.smPages.forEach(smPage => {
  //           let page = Object.assign({}, smPage);
  //           page.id = smPage.id;
  //           page.name = smPage.name;
  //           page.isSelected = false;
  //           this.viewPages.push(page);
  //         });
  //       }

  //       if (this.network.smGroups && this.network.smGroups.length > 0) {
  //         this.network.smGroups.forEach(smGroup => {
  //           let group = Object.assign({}, smGroup);
  //           group.id = smGroup.id;
  //           group.name = smGroup.name;
  //           group.isSelected = false;
  //           this.viewGroups.push(group);
  //         });
  //       }

  //       if (this.network.boards && this.network.boards.data.length > 0) {
  //         this.network.boards.data.forEach(smBoard => {
  //           let board = Object.assign({}, smBoard);
  //           board.id = smBoard.id;
  //           board.name = smBoard.name;
  //           board.isSelected = false;
  //           this.viewBoards.push(board);
  //         });
  //       }
  //     }
  //   }
  // }

  updatePages() {
    this.dataToUpdate.selectedPages = [];
    this.dataToUpdate.selectedGroups = [];
    this.dataToUpdate.selectedBoards = [];
    this.dataToUpdate.selectedChannels = [];

    if (this.network.smPages) {
      this.network.smPages.forEach(page => {
        this.viewPages.forEach(viewPage => {
          if (page.id == viewPage.id && viewPage.isSelected == true) {
            this.dataToUpdate.selectedPages.push(page);
          }
        });
      });
    }
    if (this.network.smGroups) {
      this.network.smGroups.forEach(group => {
        this.viewGroups.forEach(viewGroup => {
          if (group.id == viewGroup.id && viewGroup.isSelected == true) {
            this.dataToUpdate.selectedGroups.push(group);
          }
        });
      });
    }

    if (this.network.boards) {
      this.network.boards.data.forEach(board => {
        this.viewBoards.forEach(viewBoard => {
          if (board.id == viewBoard.id && viewBoard.isSelected == true) {
            this.dataToUpdate.selectedBoards.push(board);
          }
        });
      });
    }
    if (this.network.channelsList && this.network.channelsList.length > 0) {
      this.network.channelsList.forEach(channel => {
        this.youtubeChannels.forEach(viewChannel => {
          if (channel.id == viewChannel.id && viewChannel.isSelected == true) {
            this.dataToUpdate.selectedChannels.push(channel);
          }
        })
      })
    }
    // this.network = network;
    // })

    let data = new Object();


    data = {
      id: this.accountId,
      linkedData: {
        linked: {
          smPages: this.dataToUpdate.selectedPages,
          smGroups: this.dataToUpdate.selectedGroups,
          boards: this.dataToUpdate.selectedBoards,
          channels: this.dataToUpdate.selectedChannels,
        }
      }
    };

    if (this.dataToUpdate.selectedPages.length > 0 || this.dataToUpdate.selectedGroups.length > 0 || this.dataToUpdate.selectedBoards.length > 0 || this.dataToUpdate.selectedChannels.length > 0) {
      this.onUpdataPages.emit(data);
    } else {
      this.dataNotSelected = true;
    }
  }

  deleteAccount() {
    this.onDeleteAccount.emit(this.accountId);
    this.dialogRef.close();
  }

}
