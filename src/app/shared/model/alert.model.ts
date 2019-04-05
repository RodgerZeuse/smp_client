export class AlertModel {
    isValidate: boolean;
    messages: Array<string>;
    constructor() {
        this.isValidate = null;
        this.messages = new Array<string>();
    }
}