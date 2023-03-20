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
  const [isTimerRunning, setIsTimerRunning] = React.useState(false);
  const [isTimerPaused, setIsTimerPaused] = React.useState(false);
  const [timerKey, setTimerKey] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const [showPause, setShowPause] = React.useState(false);
  const [showStart, setShowStart] = React.useState(true);
  const [showReset, setShowReset] = React.useState(false);
  const { timerDuration, setTimerDuration } =
    React.useContext(TimeContext);

  const [startTime, warningTime, alertTime] = React.useMemo(() => {
    return [
      timerDuration * 1,
      timerDuration * 0.33,
      timerDuration * 0.12,
    ];
  }, [timerDuration]);

  React.useEffect(() => {
    window.addEventListener('mouseover', () => {
      if (isTimerRunning) {
        setShowControls(true);
      }
    });
    window.addEventListener('mouseout', () => {
      if (isTimerRunning) {
        setShowControls(false);
      }
    });

    return () => {
      window.removeEventListener('mouseover', () => {
        if (isTimerRunning) {
          setShowControls(true);
        }
      });
      window.removeEventListener('mouseout', () => {
        if (isTimerRunning) {
          setShowControls(false);
        }
      });
    };
  }, [isTimerRunning]);

  function handleStart() {
    setIsTimerRunning(true);
    setShowPause(true);
    setShowStart(false);
    setShowReset(true);
  }

  function handlePause() {
    setIsTimerPaused(!isTimerPaused);
  }

  function handleStop() {
    setIsTimerRunning(false);
    setShowPause(false);
    setShowControls(true);
    setShowStart(true);
    setShowReset(false);
    setTimerDuration(0);
  }

  function handleOnComplete() {
    sound.play();
    confetti();
    handleReset();
  }

  function handleReset() {
    handleStop();
    setTimerKey(prevKey => prevKey + 1);
  }

  const renderTime = ({ remainingTime }) => {
    let timeShown = formatTime(remainingTime);
    if (isTimerPaused) {
      const timerInterval = setInterval(() => {
        timeShown =
          timeShown === formatTime(remainingTime)
            ? ` &nbsp;&nbsp;:&nbsp;&nbsp;:&nbsp;&nbsp; `
            : formatTime(remainingTime);
      }, 500);
    }

    return (
      <span className={styles.label} role="timer">
        {timeShown}
      </span>
    );
  };

  return (
    <div className={styles.baseTimer}>
      <CountdownCircleTimer
        width={'70vh'}
        maxWidth={'400px'}
        key={timerKey}
        isPlaying={isTimerRunning && !isTimerPaused}
        duration={timerDuration}
        colors={[
          COLOR_CODES.info,
          COLOR_CODES.warning,
          COLOR_CODES.alert,
        ]}
        colorsTime={[startTime, warningTime, alertTime]}
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
