import React from 'react';
import Timer from './components/Timer/Timer';
import TimerButtons from './components/TimerButtons';
import TimeInput from './components/TimeInput';
import { TimeContext } from './context/TimeContext/TimeContextProvider';
import confetti from 'canvas-confetti';

const sound = new Audio('assets/handpan.wav');
sound.volume = 0.45;

function App() {
  const [showButtons, setShowButtons] = React.useState(true);
  const [showPause, setShowPause] = React.useState(false);
  const { secondsRemaining, desiredTime, setDesiredTime } =
    React.useContext(TimeContext);

  React.useEffect(() => {
    window.addEventListener('mouseover', () => {
      setShowButtons(true);
    });
    window.addEventListener('mouseout', () => {
      setShowButtons(false);
    });
  }, []);

  function handleStart() {
    if (secondsRemaining <= 0) {
      setShowPause(false);
      setShowButtons(true);
      setDesiredTime(0);
      sound.play();
      confetti();
    }
  }

  return (
    <div className="app">
      <header>
        <h1 id="title">TimeSense Timer</h1>
      </header>
      <Timer />
      <TimeInput />
      {showButtons && (
        <TimerButtons
          handleStart={handleStart}
          showPause={showPause}
        />
      )}
    </div>
  );
}

export default App;
