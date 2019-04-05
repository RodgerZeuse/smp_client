export class PostQueueViewModal {
    Monday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];
    Tuesday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];
    Wednesday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];
    Thursday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];
    Friday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];
    Saturday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];
    Sunday: [{ id: string, isAvailable: boolean, from: { hour: number, minute: number }, to: { hour: number, minute: number } }];

    constructor() {
        this.Monday = null;
        this.Tuesday = null;
        this.Wednesday = null;
        this.Thursday = null;
        this.Friday = null;
        this.Saturday = null;
        this.Sunday = null;
    }
}