let timeLeft = 0;
let desiredTime = 0;
let elapsedTime = 0;
let running = false;
let timerInterval = null;
let warningThreshold = 10;
let alertThreshold = 25;
let colorCodes = {}
const FULL_DASH_ARRAY = 283; // The diameter in arbitrary units for a circle with radius of 45 units
const htmlEl = document.querySelector("html");
const hoursEl = document.getElementById("hours")
const minutesEl = document.getElementById("minutes")
const secondsEl = document.getElementById("seconds")
const baseTimerLabel = document.getElementById("base-timer-label");
const sound = new Audio('assets/handpan.wav');
sound.volume = 0.45;

/* Returns a string of the time passed as an argument */
function formatTimeLeft(time) { // user-set time in seconds
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
    if (!running) {
        running = true;
        timerInterval = setInterval(() => {
            // Increment the elapsed time by 1 second
            elapsedTime++;
            timeLeft = desiredTime - elapsedTime;

            // Update time left and time fraction
            baseTimerLabel.innerHTML = formatTimeLeft(timeLeft);
            setRemainingPathColor(timeLeft);
            setCircleDasharray();

            // If the time is up, the timer is stopped
            if (timeLeft <= 0) {
                sound.play();
                confetti();
                running = false;
                elapsedTime = 0;
                clearInterval(timerInterval);
            }
        }, 1000);
    }
}

// Divides time left by the defined time limit.
function calculateTimeFraction() {
    return timeLeft / desiredTime;
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
    const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY)
        .toFixed(0)} 283`; // first number is remaining, second is total (283)
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = colorCodes;

    // If the remaining time is less than or equal to 25%, change the color to orange
    if (timeLeft <= alert.threshold) {
        htmlEl.style.setProperty('--remaining-path-color', alert.color)

        // If the remaining time is less than or equal to 10%, change the color to red
    } else if (timeLeft <= warning.threshold) {
        htmlEl.style.setProperty('--remaining-path-color', warning.color);
        // Otherwise, set the color to green
    } else {
        htmlEl.style.setProperty('--remaining-path-color', info.color);
    }
}

/* Start button event listener */
document.getElementById("start-btn").addEventListener("click", () => {
    console.log(`Now timeLeft is ${timeLeft} and desiredTime is ${desiredTime}`);
    console.log(`And elapsedTime is ${elapsedTime}`);
    if (timeLeft <= 0) {
        let hours = hoursEl.value;
        let minutes = minutesEl.value;
        let seconds = secondsEl.value;
        desiredTime = (hours * 3600) + (minutes * 60) + (seconds * 1);
    } else if (timeLeft > 0) {
        hoursEl.value = "";
        minutesEl.value = "";
        secondsEl.value = "";
    }
    warningThreshold = (desiredTime * 0.25);
    alertThreshold = (desiredTime * 0.10);

    colorCodes = {
        info: { color: "#2DAC36" }, // green 
        warning: {
            color: "#FF7A5C", // orange
            threshold: warningThreshold
        },
        alert: {
            color: "#F1224C", // red
            threshold: alertThreshold
        }
    };

    if (desiredTime > 0) {
        clearInterval(timerInterval);
        startTimer();
    }
});

/* Pause button event listener */
document.getElementById("pause-btn").addEventListener("click", () => {
    running = false;
    const originalHtml = baseTimerLabel.innerHTML;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        // the time flashes once a second
        baseTimerLabel.innerHTML = (baseTimerLabel.innerHTML === originalHtml) ? `
            &nbsp;&nbsp;:&nbsp;&nbsp;:&nbsp;&nbsp;
            ` : originalHtml;
    }, 500);
});

/* Reset button event listener */
document.getElementById("reset-btn").addEventListener("click", () => {
    running = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    timeLeft = 0;
    desiredTime = 0;
    hoursEl.value = "";
    minutesEl.value = "";
    secondsEl.value = "";
    baseTimerLabel.innerHTML = formatTimeLeft(desiredTime);
    htmlEl.style.setProperty('--remaining-path-color', '#2DAC36');
    setCircleDasharray();
}); 