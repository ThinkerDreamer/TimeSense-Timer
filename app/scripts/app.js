let desiredTime = 0;
let elapsedTime = 0;
let timeLeft = 0;
const hoursEl = document.getElementById("hours")
const minutesEl = document.getElementById("minutes")
const secondsEl = document.getElementById("seconds")
const baseTimerLabel = document.getElementById("base-timer-label");
let running = false;

function formatTimeLeft(time) { // user-set time in seconds
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    seconds = zeroPad(seconds);
    minutes = zeroPad(minutes);
    hours = zeroPad(hours);
    console.log(`${hours}:${minutes}:${seconds}`);

    return `${hours}:${minutes}:${seconds}`;
}

baseTimerLabel.innerText = formatTimeLeft(timeLeft);

function zeroPad(unit) {
    if (unit < 10) {
        return `0${unit}`;
    }
    return unit;
}

let timerInterval = null;

const COLOR_CODES = {
    info: {
        color: "green"
    }
};

let remainingPathColor = COLOR_CODES.info.color;
document.getElementById("base-timer-path-remaining").classList.add(remainingPathColor);

function startTimer() {
    if (!running) {
        running = true;
        timerInterval = setInterval(() => {
            // The amount of time passed increments by one
            elapsedTime++;
            timeLeft = desiredTime - elapsedTime;

            // The time left label is updated
            baseTimerLabel.innerHTML = formatTimeLeft(timeLeft);

            // If the time is up, the timer is stopped
            if (timeLeft <= 0) {
                running = false;
                clearInterval(timerInterval);
            }
        }, 1000);
    }
}

document.getElementById("start-btn").addEventListener("click", () => {
    let hours = hoursEl.value;
    let minutes = minutesEl.value;
    let seconds = secondsEl.value;
    desiredTime = (hours * 3600) + (minutes * 60) + (seconds * 1);

    if (desiredTime > 0) {
        console.log(`
            desiredTime = ${desiredTime},
            which is ${Math.floor((desiredTime % 3600) / 60)} 
            minutes, showing up as ${minutes} minutes.
            Minutes * 60 = ${minutes * 60}.
            Minutes * 60 + seconds = ${minutes * 60 + seconds}.
            Minutes * 6 = ${minutes * 6}.
            Hours is ${hours} and seconds is ${seconds}.
            `);
        clearInterval(timerInterval);
        startTimer();
    }
});

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

document.getElementById("reset-btn").addEventListener("click", () => {
    running = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    desiredTime = 0;
    baseTimerLabel.innerHTML = formatTimeLeft(desiredTime);
    hoursEl.value = 0;
    minutesEl.value = 0;
    secondsEl.value = 0;
}); 