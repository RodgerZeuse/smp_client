export class SearchCriteria {
    title?: string;
    state?: string;
    createdStartDate?: Date;
    createdEndDate?: Date;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    weekStartDate?: Date;
    weekEndDate?: Date;
    constructor() {
        this.title = '';
        this.state = '';
    }
}