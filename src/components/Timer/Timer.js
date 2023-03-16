import React from 'react';

function Timer() {
  // Update the dasharray value as time passes, starting with 283
  function setCircleDasharray() {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`; // first number is remaining, second is total (283)
    document
      .getElementById('base-timer-path-remaining')
      .setAttribute('stroke-dasharray', circleDasharray);
  }

  return (
    <div className="base-timer">
      <svg
        className="base-timer__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="base-timer__circle">
          <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45" />
          <path
            id="base-timer-path-remaining"
            strokeDasharray="283"
            className="base-timer__path-remaining remaining-path-color"
            d="
                              M 50, 50
                              m -45, 0
                              a 45,45 0 1,0 90,0
                              a 45,45 0 1,0 -90,0
                            "
          />
        </g>
      </svg>
      <span id="base-timer-label" className="base-timer__label" />
    </div>
  );
}

export default Timer;
