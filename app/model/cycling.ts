import Workout from "./workout.js";

export default class Cycling extends Workout {
    
    type = 'cycling';
    private _elevationGain: any;
    private speed: number;

    constructor(coords: any[], distance: number, duration: number, elevationGain: any) {
        super(coords, distance, duration);
        this._elevationGain = elevationGain;
        this.speed = 0;
        this.calcSpeed();
        super.setDescription(this.type);
    }

    get elevationGain(): number {
        return this._elevationGain;
    }

    calcSpeed(): number {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}