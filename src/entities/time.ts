export class Time {
    hours: string;
    minutes: string;
    timeOfDay: string;

    splitTime(str: String) {
        this.timeOfDay = (Number.parseInt(str.split(':')[0])) >= 12 ? 'PM' : 'AM';
        this.hours = this.timeOfDay === 'AM' ? Number.parseInt(str.split(':')[0]).toString() : (Number.parseInt(str.split(':')[0]) - 12).toString();
        this.minutes = this.zeroFill(Number.parseInt(str.split(':')[1]));
    }

    toString(): String {
        let ret = new String();
        let h = Number.parseInt(this.hours);
        ret = (this.timeOfDay === 'AM' ? h.toString() : (h+12).toString()) + ':' + this.minutes.toString();
        return ret;
    }

    zeroFill(n: number): string {
        return ('0000'+n).slice(-2);
    }
}