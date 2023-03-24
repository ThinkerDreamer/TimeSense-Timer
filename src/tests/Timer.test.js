import { render, fireEvent, screen } from '@testing-library/react';
import Timer from '../components/Timer/Timer';

// Test for the Timer component
describe('Timer', () => {
  let timer;

  beforeEach(() => {
    timer = new Timer();
    render(<Timer />);
  });

  // Test for the start method
  describe('start', () => {
    test('starts the timer', () => {
      timer.handleStart();
      expect(timer.isTimerStarted).toBe(true);
    });
  });

  // Test for the stop method

  describe('stop', () => {
    test.todo('stops the timer', () => {
      timer.start();
      timer.stop();
      expect(timer.running).toBe(false);
    });

    test.todo('does not stop a timer that is not running', () => {
      timer.stop();
      expect(timer.running).toBe(false);
    });
  });
});

function filterByTerm(inputArr, searchTerm) {
  return inputArr.filter(arrayElement =>
    arrayElement.url.match(searchTerm)
  );
}

describe('Filter function', () => {
  test('it should filter by a search term (link)', () => {
    const input = [
      { id: 1, url: 'https://www.url1.dev' },
      { id: 2, url: 'https://www.url2.dev' },
      { id: 3, url: 'https://www.link3.dev' },
    ];

    const output = [{ id: 3, url: 'https://www.link3.dev' }];

    expect(filterByTerm(input, 'link')).toEqual(output);
  });
});
