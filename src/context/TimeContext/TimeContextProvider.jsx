import React from 'react';

export const TimeContext = React.createContext();

function TimeContextProvider({ children }) {
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [secondsRemaining, setSecondsRemaining] = React.useState(0);
  const [timerDuration, setTimerDuration] = React.useState(0);
  const [desiredTime, setDesiredTime] = React.useState(0);

  return (
    <TimeContext.Provider
      value={
        (hours,
        setHours,
        minutes,
        setMinutes,
        seconds,
        setSeconds,
        secondsRemaining,
        setSecondsRemaining,
        timerDuration,
        setTimerDuration,
        desiredTime,
        setDesiredTime)
      }
    >
      {children}
    </TimeContext.Provider>
  );
}

export default TimeContextProvider;
