import React from 'react';
import styles from './TimerButtons.module.css';

function TimerButtons({ showPause }) {
  return (
    <div class={styles.buttonDiv}>
      <button id="start-btn" className={styles.button}>
        Start
      </button>
      {showPause && (
        <button id="pause-btn" className={styles.button}>
          Pause
        </button>
      )}
      <button id="reset-btn" className={styles.button}>
        Reset
      </button>
    </div>
  );
}

export default TimerButtons;
