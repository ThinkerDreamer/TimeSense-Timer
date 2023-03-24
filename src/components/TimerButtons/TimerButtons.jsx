import React from 'react';
import styles from './TimerButtons.module.css';

function TimerButtons({
  showPause,
  showStart,
  showReset,
  handleStart,
  handleReset,
  handlePause,
}) {
  return (
    <div className={styles.buttonDiv}>
      {showStart && (
        <button
          id="start-btn"
          className={styles.button}
          onClick={handleStart}
        >
          Start
        </button>
      )}
      {showPause && (
        <button
          id="pause-btn"
          className={styles.button}
          onClick={handlePause}
        >
          Pause
        </button>
      )}
      {showReset && (
        <button
          id="reset-btn"
          className={styles.button}
          onClick={handleReset}
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default TimerButtons;
