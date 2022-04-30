'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//TEST IF EXISTS NAVIGATOR OBJECT
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const { latitude: lati, longitude: long } = pos.coords;
      console.log(`https://www.google.com.br/maps/@${lati},${long}`);
    },
    function () {
      alert('errorr');
    }
  );
}
