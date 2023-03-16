let timeLeft = 0;
let desiredTime = 0;
let elapsedTime = 0;
let running = false;
let timerInterval = null;
const alertThreshold = 0.1;
const warningThreshold = 0.25;
let alertTime = desiredTime * alertThreshold;
let warningTime = desiredTime * warningThreshold;
const FULL_DASH_ARRAY = 283; // The diameter in arbitrary units for a circle with radius of 45 units
const htmlEl = document.querySelector('html');
const bodyEl = document.querySelector('body');
const titleEl = document.querySelector('#title');
const popOutIcon = document.querySelector('.pop-out-icon');
const hoursEl = document.querySelector('#hours');
const minutesEl = document.querySelector('#minutes');
const secondsEl = document.querySelector('#seconds');
const baseTimerLabel = document.querySelector('#base-timer-label');
const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const inputDiv = document.querySelector('.input-div');
const buttonDiv = document.querySelector('.button-div');
const sound = new Audio('assets/handpan.wav');
sound.volume = 0.45;

const rootStyles = getComputedStyle(htmlEl);

const OLD_COLOR_CODES = {
  info: { color: '#2DAC36' }, // green
  warning: {
    color: '#FF7A5C', // orange
  },
  alert: {
    color: '#F1224C', // red
  },
};

const COLOR_CODES = {
  info: { color: rootStyles.getPropertyValue('--new-green') }, // green
  warning: {
    color: rootStyles.getPropertyValue('--new-orange'), // orange
  },
  alert: {
    color: rootStyles.getPropertyValue('--new-red'), // red
  },
};

/* Returns a string of the time passed as an argument */
function formatTimeLeft(time) {
  // user-set time in seconds
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = time % 60;

  seconds = zeroPad(seconds);
  minutes = zeroPad(minutes);
  hours = zeroPad(hours);

  return `${hours}:${minutes}:${seconds}`;
}

baseTimerLabel.innerText = formatTimeLeft(timeLeft);

/* Utility function to zero-pad numbers when needed */
function zeroPad(unit) {
  if (unit < 10) {
    return `0${unit}`;
  }
  return unit;
}

function startTimer() {
  bodyEl.addEventListener('mouseover', () => {
    buttonDiv.style.display = 'flex';
  });
  bodyEl.addEventListener('mouseout', () => {
    buttonDiv.style.display = 'none';
  });
  timerInterval = setInterval(() => {
    // Decrement the time left by 1 second
    timeLeft--;

    // Update time fraction, redraw circle
    baseTimerLabel.innerHTML = formatTimeLeft(timeLeft);
    setRemainingPathColor(timeLeft);
    setCircleDasharray();

    // If the time is up, the timer is stopped
    if (timeLeft <= 0) {
      pauseBtn.style.display = 'none';
      buttonDiv.style.justifyContent = 'center';
      desiredTime = 0;
      clearInterval(timerInterval);
      sound.play();
      confetti();
    }
  }, 1000);
}

// Divides time left by the defined time limit.
function calculateTimeFraction() {
  return timeLeft / desiredTime;
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`; // first number is remaining, second is total (283)
  document
    .getElementById('base-timer-path-remaining')
    .setAttribute('stroke-dasharray', circleDasharray);
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  // If the remaining time is less than or equal to 10%, change the color to red
  if (timeLeft <= alertTime) {
    htmlEl.style.setProperty('--remaining-path-color', alert.color);
    // If the remaining time is less than or equal to 25%, change the color to orange
  } else if (timeLeft <= warningTime) {
    htmlEl.style.setProperty('--remaining-path-color', warning.color);
    // Otherwise, set the color to green
  } else {
    htmlEl.style.setProperty('--remaining-path-color', info.color);
  }
}

/* Start button event listener */
startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  pauseBtn.style.display = 'block';
  inputDiv.style.display = 'none';
  titleEl.style.display = 'none';
  if (desiredTime > 0) {
    // unpause
    clearInterval(timerInterval); //clear flashing time
    startTimer();
  } else {
    // not in paused state
    let hours = hoursEl.value;
    let minutes = minutesEl.value;
    let seconds = secondsEl.value;
    desiredTime = hours * 3600 + minutes * 60 + seconds * 1;
    alertTime = desiredTime * alertThreshold;
    warningTime = desiredTime * warningThreshold;
    timeLeft = desiredTime;
    hoursEl.value = '';
    minutesEl.value = '';
    secondsEl.value = '';

    if (timeLeft > 0) {
      startTimer();
    }
  }
});

/* Pause button event listener */
pauseBtn.addEventListener('click', () => {
  pauseBtn.style.display = 'none';
  startBtn.style.display = 'block';
  const originalHtml = baseTimerLabel.innerHTML;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    // the time flashes once a second
    baseTimerLabel.innerHTML =
      baseTimerLabel.innerHTML === originalHtml
        ? `
            &nbsp;&nbsp;:&nbsp;&nbsp;:&nbsp;&nbsp;
            `
        : originalHtml;
  }, 500);
});

/* Reset button event listener */
document.getElementById('reset-btn').addEventListener('click', () => {
  titleEl.style.display = 'block';
  pauseBtn.style.display = 'none';
  startBtn.style.display = 'block';
  inputDiv.style.display = 'flex';
  buttonDiv.style.justifyContent = 'space-evenly';
  clearInterval(timerInterval);
  timeLeft = 0;
  desiredTime = 0;
  hoursEl.value = '';
  minutesEl.value = '';
  secondsEl.value = '';
  startBtn.style.display = 'block';
  baseTimerLabel.innerHTML = formatTimeLeft(desiredTime);
  htmlEl.style.setProperty(
    '--remaining-path-color',
    COLOR_CODES.info.color
  );
  setCircleDasharray();
});

/* Pop out icon event listener */
popOutIcon.addEventListener('click', () => {
  let newWindow = window.open(
    '#',
    '_blank',
    'popup, toolbar=no, menubar=no, status=no, height=555, width=350'
  );
});
