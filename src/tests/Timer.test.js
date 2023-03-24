import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Timer from '../components/Timer/Timer';
import TimeContextProvider from '../context/TimeContext/TimeContextProvider';

const mockAudio = jest.fn();

jest.mock('../assets/handpan.wav', () => {
  return {
    default: mockAudio,
  };
});

beforeEach(() => {
  mockAudio.mockClear();
});

// Test for the Timer component
describe('Timer', () => {
  const wrapper = ({ children }) => (
    <TimeContextProvider>{children}</TimeContextProvider>
  );
  beforeEach(() => {
    render(<Timer />, { wrapper });
  });

  // Test for the start method
  describe('start', () => {
    test('starts the timer', async () => {
      const user = userEvent.setup();
      await user.type(screen.getByPlaceholderText('s'), '10');
      user.click(screen.getByText('Start'));
      expect(screen.getByText('00:00:10')).toBeInTheDocument();
    });
  });

  // Test for the stop method
  describe('stop', () => {
    test.todo('stops the timer');
  });

  test.todo('does not stop a timer that is not running');
});
