import React from 'react';
import Timer from './components/Timer/Timer';

function App() {
  return (
    <div className="app">
      <header>
        <h1 id="title">TimeSense Timer</h1>
      </header>
      <main>
        <Timer />
      </main>
    </div>
  );
}

export default App;
