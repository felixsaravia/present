import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isFinished: boolean;
  start: (durationSeconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

const useTimer = (initialDurationSeconds: number = 0): TimerState => {
  const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [targetDuration, setTargetDuration] = useState(initialDurationSeconds);

  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const start = useCallback((durationSeconds: number) => {
    setTargetDuration(durationSeconds);
    setTimeLeft(durationSeconds);
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
    }
  }, [timeLeft]);

  const reset = useCallback(() => {
    setTimeLeft(targetDuration);
    setIsRunning(false);
    setIsFinished(false);
  }, [targetDuration]);

  return { timeLeft, isRunning, isFinished, start, pause, resume, reset };
};

export default useTimer;