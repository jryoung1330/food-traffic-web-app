import { Time } from "./time";

export class OperationItem {
    id: number;
    vendorId: number;
    dayOfWeek: String;
    closed: boolean;
    openTime: String;
    closeTime: String;
    openDateTime: Date;
    closeDateTime: Date;
    timeLeft: number;
    open: Time;
    close: Time;
    event: boolean;
    eventName: String;
    eventUrl: String;
    eventStartDate: Date;
    eventEndDate: Date;
}