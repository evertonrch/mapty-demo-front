import Workout from "./workout.js";

export default class Running extends Workout {

    type = 'running';
    private pace: number;
    protected duration: number;
    protected distance: number;
    private _cadence: number;

    constructor(coords: any[], distance: number, duration: number, cadence: number) {
        super(coords, distance, duration);
        this._cadence = cadence;
        this.pace = 0.0;
        this.duration = 0.0;
        this.distance = 0.0;
        this.calcPace();
        super.setDescription(this.type);
    }

    get cadence(): number {
        return this._cadence;
    }

    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}