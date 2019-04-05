export class SwitchViewsModel {
    isCalendarOpen: boolean;
    isListOpen: boolean;
    isTimelineOpen: boolean;
    constructor() {
        this.isCalendarOpen = true;
        this.isListOpen = false;
        this.isTimelineOpen = false;
    }
}