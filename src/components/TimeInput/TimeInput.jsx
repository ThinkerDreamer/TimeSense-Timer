import React from 'react';
import VisuallyHidden from '../VisuallyHidden';
import styles from './TimeInput.module.css';

function TimeInput({ time, setTime, setTimerDuration }) {
  const [hours, minutes, seconds] = time;
  const [setHours, setMinutes, setSeconds] = setTime;


  return (
    <div className={styles.inputDiv}>
      <VisuallyHidden>Hours input</VisuallyHidden>
      <input
        className={styles.timeInput}
        id="hours"
        type="number"
        min="0"
        max="23"
        placeholder="h"
        value={hours}
        onChange={e => setHours(e.target.value)}
      />

      <span>:</span>
      <VisuallyHidden>Minutes input</VisuallyHidden>
      <input
        className={styles.timeInput}
        id="minutes"
        type="number"
        min="0"
        max="59"
        placeholder="m"
        value={minutes}
        onChange={e => setMinutes(e.target.value)}
      />

      <span>:</span>
      <VisuallyHidden>Seconds input</VisuallyHidden>
      <input
        className={styles.timeInput}
        id="seconds"
        type="number"
        min="0"
        max="59"
        placeholder="s"
        value={seconds}
        onChange={e => setSeconds(e.target.value)}
      />
    </div>
  );
}

export default TimeInput;
