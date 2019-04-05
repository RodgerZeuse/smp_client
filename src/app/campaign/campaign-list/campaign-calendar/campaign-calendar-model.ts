import { Subject } from "rxjs";
import { CalendarEvent, CalendarView, CalendarMonthViewDay } from 'angular-calendar';

export class CampaignCalendar {
    refresh: Subject<any> = new Subject();
    calendarView: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    eventColors: any;
    calendarEvents: Array<CalendarEvent> = new Array<CalendarEvent>();
    currentViewDate: Date = new Date();
    activeDayIsOpen: boolean;
    selectedMonthViewDay: CalendarMonthViewDay;
    isMessageBoxShow: boolean;
    isMousePointerActive: boolean;
    
    constructor(){
        this.isMessageBoxShow = false;
        this.isMousePointerActive = false;
    }
}