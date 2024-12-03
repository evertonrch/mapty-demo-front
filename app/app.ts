import Cycling from "./model/cycling.js";
import Running from "./model/running.js";
import * as L from 'leaflet';
import Workout from "./model/workout.js";

const form = document.querySelector('.form')! as HTMLFormElement;
const containerWorkouts = document.querySelector('.workouts')! as HTMLElement;
const inputType = document.querySelector('.form__input--type')! as HTMLInputElement;
const inputDistance = document.querySelector('.form__input--distance')! as HTMLInputElement;
const inputDuration = document.querySelector('.form__input--duration')! as HTMLInputElement;
const inputCadence = document.querySelector('.form__input--cadence')! as HTMLInputElement;
const inputElevation = document.querySelector('.form__input--elevation')! as HTMLInputElement;

const run1 = new Running([-23, 44], 5.2, 24, 178);
const cyc1 = new Cycling([-23, 44], 10.33, 95, 344);

//////////////////////////////
class App {
  private map: any;
  private mapZoomLevel = 13;
  private mapEvent: any;
  private workouts: Workout[] = [];

  constructor() {
    //Get position
    this._getPosition();

    //Get data from localStorage
    this._getLocalStorage();

    //Event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      () => alert('Could not get your position')
    );
  }

  _loadMap(pos: any) {
    const { latitude: lat, longitude: lng } = pos.coords;

    this.map = L.map('map').setView([lat, lng], this.mapZoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    //const coords = [lat, lng];
    this.map.on('click', this._showForm.bind(this));

    this.workouts.forEach(workout => {
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapE: any) {
    this.mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    //Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row')!.classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row')!.classList.toggle('form__row--hidden');
  }

  _newWorkout(e: Event) {
    const validInputs = (...inputs: any[]) =>
      inputs.every(input => Number.isFinite(input));

    const allPositives = (...inputs: any[]) => inputs.every(input => input > 0);

    e.preventDefault();
    //Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.mapEvent.latlng;
    let workout: Workout | undefined;

    //If workout running, create running obj
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //Check if data is valid
      //Guard clausule
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositives(distance, duration, cadence)
      )
        return alert('Input have to be positive numbers');

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    //If workout cycling, create cycling obj
    if (type === 'cycling') {
      //Must be less than 0
      const elevation = +inputElevation.value;
      //Guard clausule
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositives(distance, duration)
      )
        return alert('Input have to be positive numbers');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Add new obj to workout array
    this.workouts.push(workout as Workout);

    //Render workout on map as marker
    this._renderWorkoutMarker(workout);

    //Render workout on list
    this._renderWorkout(workout);

    //Clear input fields + hide form
    this._hideForm();

    //Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout: any) {
    L.marker(workout.coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout: any) {
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `;

    if (workout.type === 'running') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === 'cycling') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
          </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e: any) {
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.workouts.find(
      workout => workout.id === workoutEl.dataset.id
    );

    this.map.setView(workout!.coords, this.mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    //Using API
    //workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts') as string);

    if (!data) return;

    this.workouts = data;

    this.workouts.forEach(workout => {
      this._renderWorkout(workout);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
