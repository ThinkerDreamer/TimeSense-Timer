import React from 'react';
import styles from './Timer.module.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import TimerButtons from '../TimerButtons';
import TimeInput from '../TimeInput';
import confetti from 'canvas-confetti';
import Handpan from '../../assets/handpan.wav';

const sound = new Audio(Handpan);
sound.volume = 0.45;

const COLOR_CODES = {
  info: '#5dd9c1', // green
  warning: '#ffbe86', // orange
  alert: '#ff729f', // red
};

function Timer() {
  // isTimerStarted controls the whole start-to-end state
  const [isTimerStarted, setIsTimerStarted] = React.useState(false);
  // isTimerPaused is used for controlling the flashing numbers
  const [isTimerPaused, setIsTimerPaused] = React.useState(false);

  // timerKey is incremented on every recreation of the timer
  const [timerKey, setTimerKey] = React.useState(0);

  const [showPauseButton, setShowPauseButton] = React.useState(false);
  const [showStartButton, setShowStartButton] = React.useState(true);
  const [showResetButton, setShowResetButton] = React.useState(false);

  const [hours, setHours] = React.useState('');
  const [minutes, setMinutes] = React.useState('');
  const [seconds, setSeconds] = React.useState('');

  const [timerDuration, setTimerDuration] = React.useState(0);

  React.useEffect(() => {
    const newDuration =
      Number(hours) * 3600 +
      Number(minutes) * 60 +
      Number(seconds) * 1;
    setTimerDuration(newDuration);
  }, [hours, minutes, seconds, setTimerDuration]);

  // Memoize the warningTime and alertTime for each cycle
  const [warningTime, alertTime] = React.useMemo(() => {
    return [timerDuration * 0.33, timerDuration * 0.12];
  }, [timerDuration]);

  // While paused, the numbers flash and the colons are still
  const [areNumbersVisible, setAreNumbersVisible] =
    React.useState(true);
  React.useEffect(() => {
    const flashingInterval = setInterval(() => {
      setAreNumbersVisible(prev => !prev);
    }, 500);

    return () => clearInterval(flashingInterval);
  }, [isTimerPaused]);

  // Handler for the start button:
  // shows/hides elements as needed
  function startButtonHandler() {
    if (!isTimerStarted) {
      setIsTimerStarted(true);
    }
    setIsTimerPaused(false);
    setShowPauseButton(true);
    setShowStartButton(false);
    setShowResetButton(true);
  }

  // Handler for the pause button
  function pauseButtonHandler() {
    setIsTimerPaused(true);
    setShowPauseButton(false);
    setShowStartButton(true);
  }

  // Handler for ending the timer whether
  // it ended on time or it was reset
  function handleOnTimerEndingOrReset() {
    setIsTimerStarted(false);
    setIsTimerPaused(false);
    setShowPauseButton(false);
    setShowStartButton(true);
    setTimerDuration(0); // if not used, React will crash
  }

  // Handler for when the timer runs out
  function handleOnComplete() {
    sound.play();
    confetti();
    setShowResetButton(true);
  }

  // Handler for the reset button: increments
  // the key to create a new timer instance
  function resetButtonHandler() {
    handleOnTimerEndingOrReset();
    setHours('');
    setMinutes('');
    setSeconds('');
    setTimerKey(prevKey => prevKey + 1);
  }

  // Function to render the time with numbers that
  // flash while the timer is paused
  const renderTime = ({ remainingTime }) => {
    // Convert the remaining time to hours, minutes, and seconds
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const hoursDisplay = hours < 10 ? `0${hours}` : hours;
    const minutesDisplay = minutes < 10 ? `0${minutes}` : minutes;
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;

    // Split the timer string into separate elements for the numbers and colons
    const elements =
      `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`
        .split('')
        .map((char, i) => {
          if (!isTimerPaused) {
            return char;
          } else {
            if (/\d/.test(char)) {
              // If the character is a digit, wrap it in a span with the flashing effect
              return (
                <span
                  key={i}
                  style={{
                    visibility: areNumbersVisible
                      ? 'visible'
                      : 'hidden',
                  }}
                >
                  {char}
                </span>
              );
            } else {
              // If the character is a colon, just return it as-is
              return char;
            }
          }
        });

    return <div className={styles.label}>{elements}</div>;
  };

  const [timerSize, setTimerSize] = React.useState(() => {
    const width = window.innerWidth;
    return width < 600 ? width * 0.8 : 400;
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setTimerSize(width < 600 ? width * 0.8 : 400);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.baseTimer}>
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={isTimerStarted && !isTimerPaused}
        duration={timerDuration}
        colors={[
          COLOR_CODES.info, // This is for the beginning color
          COLOR_CODES.warning,
          COLOR_CODES.alert,
          COLOR_CODES.alert, // This is for the end color
        ]}
        colorsTime={[timerDuration, warningTime, alertTime, 0]}
        trailColor={'var(--button-color)' || '#665687'}
        rotation={'counterclockwise'}
        size={timerSize}
        strokeWidth={timerSize * 0.1}
        initialRemainingTime={0}
        onComplete={handleOnComplete}
      >
        {renderTime}
      </CountdownCircleTimer>
      <div className={styles.controlsBox}>
        <TimeInput
          time={[hours, minutes, seconds]}
          setTime={[setHours, setMinutes, setSeconds]}
          setTimerDuration={setTimerDuration}
        />
        <TimerButtons
          handleStart={startButtonHandler}
          handleReset={resetButtonHandler}
          handlePause={pauseButtonHandler}
          showPause={showPauseButton}
          showStart={showStartButton}
          showReset={showResetButton}
        />
      </div>
    </div>
  );
}

export default Timer;
