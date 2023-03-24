import React from 'react';

export const TimeContext = React.createContext();

function TimeContextProvider({ children }) {
  const [timerDuration, setTimerDuration] = React.useState(0);

  return (
    <TimeContext.Provider
      value={{
        timerDuration,
        setTimerDuration,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export default TimeContextProvider;
