import React from 'react';
import formatTime from '../../utilities/formatTime';
import styles from './Timer.module.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { TimeContext } from '../../context/TimeContext/TimeContextProvider';
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
  const [areNumbersVisible, setAreNumbersVisible] =
    React.useState(true);
  // timerKey is incremented on every recreation of the timer
  const [timerKey, setTimerKey] = React.useState(0);

  const [showControls, setShowControls] = React.useState(true);
  const [showPause, setShowPause] = React.useState(false);
  const [showStart, setShowStart] = React.useState(true);
  const [showReset, setShowReset] = React.useState(false);
  const { timerDuration, setTimerDuration } =
    React.useContext(TimeContext);

  // Memoize the warningTime and alertTime for each cycle
  const [warningTime, alertTime] = React.useMemo(() => {
    return [timerDuration * 0.33, timerDuration * 0.12];
  }, [timerDuration]);

  // While paused, the numbers flash and the colons are still
  React.useEffect(() => {
    const flashingInterval = setInterval(() => {
      setAreNumbersVisible(prev => !prev);
    }, 500);

    return () => clearInterval(flashingInterval);
  }, [isTimerPaused]);

  // Handler for the start button:
  // shows/hides elements as needed
  function handleStart() {
    if (!isTimerStarted) {
      setIsTimerStarted(true);
    }
    setIsTimerPaused(false);
    setShowPause(true);
    setShowStart(false);
    setShowReset(true);
  }

  // Handler for the pause button
  function handlePause() {
    setIsTimerPaused(true);
    setShowPause(false);
    setShowStart(true);
  }

  // Handler for ending the timer whether
  // it ended on time or it was reset
  function handleStop() {
    setIsTimerStarted(false);
    setIsTimerPaused(false);
    setShowPause(false);
    setShowControls(true);
    setShowStart(true);
    setShowReset(false);
    setTimerDuration(0); // if not used, React will crash
  }

  // Handler for when the timer runs out
  function handleOnComplete() {
    sound.play();
    confetti();
    handleReset();
  }

  // Handler for the reset button: increments
  // the key to create a new timer instance
  function handleReset() {
    handleStop();
    setTimerKey(prevKey => prevKey + 1);
  }

  // Function to render the time with numbers that
  // flash while the timer is paused
  const renderTime = ({ remainingTime }) => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor(remainingTime / 60);
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

  return (
    <div className={styles.baseTimer}>
      <CountdownCircleTimer
        width={'70vh'}
        maxWidth={'400px'}
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
        size={400}
        strokeWidth={40}
        initialRemainingTime={0}
        onComplete={handleOnComplete}
      >
        {renderTime}
      </CountdownCircleTimer>
      {showControls && (
        <div className={styles.controlsArea}>
          <TimeInput />
          <TimerButtons
            handleStart={handleStart}
            handleReset={handleReset}
            handlePause={handlePause}
            showPause={showPause}
            showStart={showStart}
            showReset={showReset}
          />
        </div>
      )}
    </div>
  );
}

export default Timer;
