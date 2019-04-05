export class SearchCampaign {
    title?: string;
    state?: string;
    createdStartDate?: Date;
    createdEndDate?: Date;
    scheduledStartDate?: Date;
    scheduledEndDate?: Date;
    createdAtCriteria: string;
    scheduledAtCriteria: string;
    constructor() {
        this.title = '';
        this.state = '';
        this.scheduledStartDate = null;
        this.scheduledEndDate = null;
        this.createdStartDate = null;
        this.createdEndDate = null;
    }
}