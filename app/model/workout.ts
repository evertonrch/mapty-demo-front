export default class Workout {
    
    private date;
    private _id;
    private _clicks;
    coords: any[];
    protected distance: number;
    protected duration: number;
    private description: string;


    constructor(coords: any[], distance: number, duration: number) {
        this.coords = coords; // in [lat, lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
        this._clicks = 0
        this._id = (Date.now() + '').slice(-10);
        this.date = new Date();
        this.description = "";
    }

    get id() {
        return this._id;
    }

    protected setDescription(type: string) {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        this.description = `${type[0].toUpperCase()}${type.slice(1)} on ${months[this.date.getMonth()]
            }, ${this.date.getDate()}`;
    }

    get clicks() {
        return this._clicks;
    }

    click() {
        this._clicks++;
    }
}