export class CustomDate {
    month: number;
    date: number;
    year: number;
    dayOfWeek: number;
    isToday: boolean;
    dateRef: Date;

    constructor(date: Date) {
        this.month = date.getMonth() + 1;
        this.date = date.getDate();
        this.year = date.getFullYear();
        this.dayOfWeek = ((date.getDay() + 6) % 7);
        this.isToday = new Date().getDate() == this.date;
        this.dateRef = date;
    }
}