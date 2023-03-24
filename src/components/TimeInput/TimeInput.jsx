import React from 'react';
import VisuallyHidden from '../VisuallyHidden';
import styles from './TimeInput.module.css';
import { TimeContext } from '../../context/TimeContext/TimeContextProvider';

function TimeInput() {
  const { setTimerDuration } = React.useContext(TimeContext);
  const [hours, setHours] = React.useState('');
  const [minutes, setMinutes] = React.useState('');
  const [seconds, setSeconds] = React.useState('');

  React.useEffect(() => {
    const newDuration =
      Number(hours) * 3600 +
      Number(minutes) * 60 +
      Number(seconds) * 1;
    setTimerDuration(newDuration);
  }, [hours, minutes, seconds, setTimerDuration]);

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
