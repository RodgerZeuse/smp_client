import { Component, Input, OnChanges, ViewEncapsulation, EventEmitter, Output, HostListener, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarEventTitleFormatter } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Campaign } from '../../../shared/sdk/models';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalDialogComponent } from '../../../shared/global-dialog/global-dialog.component';
import * as moment from "moment";
import { CampaignsStore } from '../../../store/campaigns-store';
import { CustomEventFormatter } from './custom-event-formatter';
import { CampaignCalendar } from './campaign-calendar-model';
import { UserProfile } from '../../../store/user-profile';
import { MatSnackBar } from '@angular/material';
let errors = require('../../../shared/config/specificError.json').specificError;

@Component({
    selector: 'campaign-calendar',
    templateUrl: './campaign-calendar.component.html',
    styleUrls: ['./campaign-calendar.component.css'],
    providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventFormatter
        }
    ],
    encapsulation: ViewEncapsulation.None
})

export class CampaignCalendarComponent implements OnInit, OnChanges {
    groupRights = require("../../../shared/config/group-rights.json").groupRights;

    icons: object = {};
    @Input() campaigns: Array<Campaign>;
    @Output() selectedDate: EventEmitter<Date> = new EventEmitter<Date>();
    @Output() changeDate: EventEmitter<object> = new EventEmitter<object>();
    @Output() remove: EventEmitter<Campaign> = new EventEmitter<Campaign>();

    imagePath: string;
    selectedDays: Array<CalendarMonthViewDay> = Array<CalendarMonthViewDay>();
    campaignCalendar: CampaignCalendar = new CampaignCalendar();
    campaign: Campaign = new Campaign();
    today: Date = new Date();
    todayIsActive: boolean = true;
    postedOrCanceled = {
        isDragged: false,
        type: 'string'
    }

    @HostListener('window:mouseup', ['$event'])
    dropCalendarEvent(e) {
        this.campaignCalendar.isMousePointerActive = false;
        this.campaignCalendar.isMessageBoxShow = false;
    }

    @HostListener('mousemove', ['$event'])
    deactivePointer(e) {
        this.campaignCalendar.isMousePointerActive = false;
        this.campaignCalendar.isMessageBoxShow = false;
    }

    constructor(private snackBar: MatSnackBar, private router: Router, private campaignStore: CampaignsStore, private dialog: MatDialog, private profileStore: UserProfile) {
        this.campaignCalendar.isMessageBoxShow = false;
        this.campaignCalendar.isMousePointerActive = false;
    }

    ngOnChanges() {
        this.campaignCalendar.activeDayIsOpen = false;
        this.loadColors();
    }

    ngOnInit() {

        this.imagePath = require("./../../../shared/config/urls.json").IMAGE_DOWNLOAD_END_POINT_URL;
        this.icons = require("./../../../shared/config/icons.json").icons;
        this.postedOrCanceled.isDragged = false;
        this.postedOrCanceled.type = '';
    }

    loadColors() {
        this.campaignCalendar.eventColors = require("./../../../shared/config/colors.json").colors;
        this.showEvents();
    }

    showEvents() {
        this.campaignCalendar.calendarEvents = this.campaigns.map((campaign) => {
            let shownDate = moment(campaign.scheduledAt).toDate();
            return {
                id: campaign.id,
                start: shownDate,
                meta: campaign,
                title: campaign.title,
                color: (campaign.state == "Draft" ? this.campaignCalendar.eventColors.yellow : campaign.state == "Scheduled" ? this.campaignCalendar.eventColors.blue : campaign.state == "Posted" ? this.campaignCalendar.eventColors.green : campaign.state == "InQueue" ? this.campaignCalendar.eventColors.pink : this.campaignCalendar.eventColors.red),
                actions: ((campaign.state == "Posted" && (this.profileStore.userAccountType == 'company' || (campaign['ownerId'] == this.profileStore.userId && this.profileStore.haveAccess(this.groupRights.reschedulemy)) || this.profileStore.haveAccess(this.groupRights.rescheduleany))) ? this.actionsForPosted : campaign.state == "Canceled" ? this.actionsForCanceled : (this.profileStore.userAccountType == 'company' || (campaign['ownerId'] == this.profileStore.userId && (this.profileStore.haveAccess(this.groupRights.deletemy) && this.profileStore.haveAccess(this.groupRights.updatemy))) || (this.profileStore.haveAccess(this.groupRights.deleteany) && this.profileStore.haveAccess(this.groupRights.updateany))) ? this.actionsForAllRights : campaign['ownerId'] == this.profileStore.userId && this.profileStore.haveAccess(this.groupRights.deletemy) || this.profileStore.haveAccess(this.groupRights.deleteany) ? this.actionsToDeleteCampaigns : (campaign['ownerId'] == this.profileStore.userId && this.profileStore.haveAccess(this.groupRights.updatemy)) || this.profileStore.haveAccess(this.groupRights.updateany) ? this.actionsToEditCampaigns : this.actionsForNone),
                draggable: (campaign.state == "Posted" || campaign.state == "Canceled") ? false : true
            }
        });
    }

    actionsForAllRights: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edit', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Delete', event);
            }
        }
    ];

    actionsToDeleteCampaigns: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Delete', event);
            }
        }
    ];

    actionsToEditCampaigns: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edit', event);
            }
        }
    ];

    actionsForNone: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-ban"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.rightsForDeleteAndEditDialog();
            }
        }
    ];

    actionsForPosted: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-repeat"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edit', event);
            }
        }
    ];

    actionsForCanceled: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-repeat"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edit', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Delete', event);
            }
        }
    ];

    handleEvent(action: string, event: CalendarEvent): void {
        this.campaignCalendar.isMousePointerActive = true;
        if (action == "ShowDetails") {
            this.getCampainById(event.id);
            setTimeout(() => {
                this.campaignCalendar.isMessageBoxShow = true;
            }, 1000);
            this.campaignCalendar.isMessageBoxShow = false;

        }
        else if (action == "Edit") {
            this.editCampaign(event);
        }
        else if (action == "Delete") {
            this.deleteDialogBox(event);
        }

        // let div=document.getElementsByClassName('custom-modal') as HTMLCollectionOf<HTMLElement>;
        // let div  = <HTMLElement>document.querySelector('.custom-modal');
        //     console.log("hover element",div)
        // let divCoordinates = div.getBoundingClientRect();
        // if(html.pageX > divCoordinates.width){
        // div.style.left = html.clientX + 'px';
        // div.style.top = (html.clientX - 150) + 'px';
        // }else{
        //     div.style.left =  '0px';
        //     div.style.top = (html.pageY - 150) + 'px';
        // }
        // div[0].style.left = this.positionX + 'px';
        // div[0].style.top = this.positionY  + 'px';


        // $(".custom-modal").css({"left":html.pageX})
    }

    editCampaign(event) {
        this.router.navigate(['/campaign/edit-campaign'], { queryParams: { id: event.id } })
    }

    removeCampaign(campaign: Campaign) {
        this.remove.emit(campaign)
    }

    rescheduleCampaignDate({ event, newStart }: CalendarEventTimesChangedEvent): void {
        console.log("Event is", event.meta);
        this.campaigns.forEach(cam => {
            if (cam.id == event.id) {
                if (cam.state == "Posted" || cam.state == "Canceled") {
                    this.postedOrCanceled.isDragged = true;
                    this.postedOrCanceled.type = cam.state;
                    this.snackBar.open(cam.state + " is not allowed to reschedual", "Ok", { duration: 2000, });
                }
                else if ((event.meta['ownerId'] == this.profileStore.userId && this.profileStore.haveAccess(this.groupRights.reschedulemy)) || this.profileStore.haveAccess(this.groupRights.rescheduleany) || this.profileStore.userAccountType == "company") {
                    let scheduledAt = new Date(cam.scheduledAt);
                    let date = new Date(newStart.toDateString());
                    let newDay = date.getDate();
                    let newMonth = date.getMonth() + 1;
                    let newYear = date.getFullYear();
                    let scheduledDate = (newYear + "-" + newMonth + "-" + newDay);
                    let timeStamp = scheduledAt.getTime();
                    let time = new Date(timeStamp);
                    let hours = time.getHours();
                    let minutes = time.getMinutes();
                    let formatedTime = hours + ':' + minutes + ':00';
                    let newDate = new Date(scheduledDate + ' ' + formatedTime);
                    event.start = (newDate > this.today ? newDate : scheduledAt);
                    this.changeDate.emit({ "id": event.id, "newDate": event.start });
                    this.campaignCalendar.refresh.next();
                }
                else {
                    this.snackBar.open("You are not allowed to reschedual", "Ok", { duration: 2000, });
                }
            }
        });
    }

    rescheduleCampaignDateAndTime({ event, newStart }: CalendarEventTimesChangedEvent): void {
        this.campaigns.forEach(cam => {
            if (cam.id == event.id) {
                if (cam.state == "Posted" || cam.state == "Canceled") {
                    this.postedOrCanceled.isDragged = true;
                    this.postedOrCanceled.type = cam.state;
                    this.snackBar.open(cam.state + " is not allowed to reschedual", "Ok", { duration: 2000, });
                }
                else if ((event.meta['ownerId'] == this.profileStore.userId && this.profileStore.haveAccess(this.groupRights.reschedulemy)) || this.profileStore.haveAccess(this.groupRights.rescheduleany) || this.profileStore.userAccountType == "company") {
                    let scheduledAt = new Date(cam.scheduledAt)
                    let date = new Date(newStart.toDateString());
                    let newDay = date.getDate();
                    let newMonth = date.getMonth() + 1;
                    let newYear = date.getFullYear();
                    let scheduledDate = (newYear + "-" + newMonth + "-" + newDay);
                    let timeStamp = newStart.getTime();
                    let time = new Date(timeStamp);
                    let hours = time.getHours();
                    let minutes = time.getMinutes();
                    let formatedTime = hours + ':' + minutes + ':00';
                    let newDate = new Date(scheduledDate + ' ' + formatedTime);
                    event.start = (newDate > this.today ? newDate : scheduledAt);
                    this.changeDate.emit({ "id": event.id, "newDate": event.start });
                    this.campaignCalendar.refresh.next();
                }
                else {
                    this.snackBar.open("You are not allowed to reschedual", "Ok", { duration: 2000, });
                }
            }
        });
    }

    rescheduleCampaignTime({ event, newStart }: CalendarEventTimesChangedEvent): void {
        this.campaigns.forEach(cam => {
            if (cam.id == event.id) {
                if (cam.state == "Posted" || cam.state == "Canceled") {
                    this.postedOrCanceled.isDragged = true;
                    this.postedOrCanceled.type = cam.state;
                    this.snackBar.open(cam.state + " is not allowed to drag", "Ok", { duration: 2000, });
                }
                else if ((event.meta['ownerId'] == this.profileStore.userId && this.profileStore.haveAccess(this.groupRights.reschedulemy)) || this.profileStore.haveAccess(this.groupRights.rescheduleany) || this.profileStore.userAccountType == "company") {
                    let date = new Date(cam.scheduledAt);
                    let newDay = date.getDate();
                    let newMonth = date.getMonth() + 1;
                    let newYear = date.getFullYear();
                    let scheduledDate = (newYear + "-" + newMonth + "-" + newDay);
                    let timeStamp = newStart.getTime();
                    let time = new Date(timeStamp);
                    let hours = time.getHours();
                    let minutes = time.getMinutes();
                    let formatedTime = hours + ':' + minutes + ':00';
                    let newDate = new Date(scheduledDate + ' ' + formatedTime);
                    event.start = (newDate > this.today ? newDate : date);
                    this.changeDate.emit({ "id": event.id, "newDate": event.start });
                    this.campaignCalendar.refresh.next();
                }
                else {
                    this.snackBar.open("You are not allowed to reschedual", "Ok", { duration: 2000, });
                }
            }
        });
    }

    getCampainById(id: string | number) {
        this.campaign = this.campaignStore.campaignById(id);
    }

    showDayEvents(day: CalendarMonthViewDay): void {
        if (isSameMonth(day.date, this.campaignCalendar.currentViewDate)) {
            if (day.date >= this.today) {
                this.selectedDate.emit(day.date);
            }
            this.campaignCalendar.currentViewDate = day.date;
            if ((isSameDay(this.campaignCalendar.currentViewDate, day.date) && this.campaignCalendar.activeDayIsOpen === true) ||
                day.events.length === 0) {
                this.campaignCalendar.activeDayIsOpen = false;
            } else {
                this.campaignCalendar.activeDayIsOpen = true;
            }
        }
        this.changeCellColor(day);
    }

    changeCellColor(day: CalendarMonthViewDay) {
        this.campaignCalendar.selectedMonthViewDay = day;
        const selectedDateTime = this.campaignCalendar.selectedMonthViewDay.date.getTime();
        const dateIndex = this.selectedDays.findIndex(
            selectedDay => selectedDay.date.getTime() === selectedDateTime
        );
        if (dateIndex > -1) {
            delete this.campaignCalendar.selectedMonthViewDay.cssClass;
            this.selectedDays.splice(dateIndex, 1);
        } else {
            this.selectedDays.splice(0, 1);
            this.selectedDays.push(this.campaignCalendar.selectedMonthViewDay);
            day.cssClass = 'cal-day-selected';
            this.campaignCalendar.selectedMonthViewDay = day;
        }
    }

    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        body.forEach(day => {
            if (this.selectedDays.some(selectedDay => selectedDay.date.getTime() === day.date.getTime())) {
                day.cssClass = 'cal-day-selected';
            }
        });
    }

    selectedButton(calledButton: string) {
        if (calledButton == "today") {
            this.todayIsActive = true;
        } else {
            this.todayIsActive = false;
        }
    }

    deleteDialogBox(event) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            heading: 'Delete Campaign..',
            description: errors.deleteCampaignPopup + this.campaigns.find(x => x.id == event.id).title,
            actionButtonText: 'Yes'
        }
        this.dialog.open(GlobalDialogComponent, dialogConfig).afterClosed().subscribe(
            data => {
                if (data == true) {
                    this.removeCampaign(event);
                }
            }
        );
    }

    releazePointer() {
        this.campaignCalendar.isMessageBoxShow = false;
        this.campaignCalendar.isMousePointerActive = true;
    }

    rightsForDeleteAndEditDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            heading: 'Insufficient rights..!',
            description: errors.rightsForDeleteAndEditPopup,
            // inputHeading: 'Feed back ',
            // actionButtonText: 'Delete'
        };

        const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
        });
    }


    closeDialog() {
        this.postedOrCanceled.isDragged = false;
    }
}