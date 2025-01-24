import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import Timer from './components/Timer/Timer';

function App() {
  return (
    <div className="app">
      <header>
        <h1 id="title">TimeSense Timer</h1>
        <PopoutButton></PopoutButton>
      </header>
      <main>
        <Timer />
      </main>
    </div>
  );
}

function PopoutButton() {
  return (
    <div className="pop-out-icon" title="Pop out timer">
      <FontAwesomeIcon
        icon={faUpRightFromSquare}
        onClick={() =>
          window.open(
            '#',
            '_blank',
            'popup, toolbar=no, menubar=no, status=no, height=555, width=350'
          )
        }
      />
    </div>
  );
}

export default App;
