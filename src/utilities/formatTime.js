/* Returns a string of the time passed as an argument */
function formatTime(time) {
  // user-set time in seconds
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;

  seconds = zeroPad(seconds);
  minutes = zeroPad(minutes);
  hours = zeroPad(hours);

  return `${hours}:${minutes}:${seconds}`;
}

/* Utility function to zero-pad numbers when needed */
function zeroPad(unit) {
  if (unit < 1) {
    return '00';
  }
  if (unit < 10) {
    return `0${unit}`;
  }
  return unit;
}

export default formatTime;
