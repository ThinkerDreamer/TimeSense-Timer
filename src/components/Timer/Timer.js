import React from 'react';
import { formatTime } from '../../utilities/formatTime';
import styles from './Timer.module.css';
import { TimeContext } from '../../context/TimeContext/TimeContextProvider';

const FULL_DASH_ARRAY = 283; // The diameter in arbitrary units for a circle with radius of 45 units
const docStyle = getComputedStyle(document.documentElement);

const COLOR_CODES = {
  info: { color: docStyle.getPropertyValue('--new-green') }, // green
  warning: {
    color: docStyle.getPropertyValue('--new-orange'), // orange
  },
  alert: {
    color: docStyle.getPropertyValue('--new-red'), // red
  },
};

function Timer() {
  const { secondsRemaining, setSecondsRemaining, timerDuration } =
    React.useContext(TimeContext);

  // Update the dasharray value as time passes, starting with 283
  // first number is remaining, second is total (283)
  const circleDasharray = `${(
    (secondsRemaining / timerDuration) *
    FULL_DASH_ARRAY
  ).toFixed(0)} 283`;

  const { alert, warning, info } = COLOR_CODES;
  // If the remaining time is less than or equal to 10%, change the color to red
  if (secondsRemaining <= timerDuration) {
    docStyle.setProperty('--remaining-path-color', alert.color);
    // If the remaining time is less than or equal to 25%, change the color to orange
  } else if (secondsRemaining <= timerDuration) {
    docStyle.setProperty('--remaining-path-color', warning.color);
    // Otherwise, set the color to green
  } else {
    docStyle.setProperty('--remaining-path-color', info.color);
  }

  return (
    <div className={styles.baseTimer}>
      <svg
        className={styles.svg}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={styles.circle}>
          <circle
            className={styles.pathElapsed}
            cx="50"
            cy="50"
            r="45"
          />
          <path
            id="base-timer-path-remaining"
            strokeDasharray={circleDasharray}
            className={`${styles.pathRemaining} ${styles.remainingPathColor}`}
            d="
                              M 50, 50
                              m -45, 0
                              a 45,45 0 1,0 90,0
                              a 45,45 0 1,0 -90,0
                            "
          />
        </g>
      </svg>
      <span id="base-timer-label" className={styles.label}>
        {formatTime(secondsRemaining)}
      </span>
    </div>
  );
}

export default Timer;
