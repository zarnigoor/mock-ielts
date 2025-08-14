import React, { useState, useEffect } from 'react';

const Timer = ({ initialMinutes = 10, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(isActive);
  const [startTime, setStartTime] = useState(null);

  // LocalStorage keys
  const TIMER_KEY = 'ielts_test_timer';
  const START_TIME_KEY = 'ielts_test_start_time';

  useEffect(() => {
    // Timer boshlanganda LocalStorage'dan vaqtni olish
    const savedStartTime = localStorage.getItem(START_TIME_KEY);
    const currentTime = Date.now();

    if (savedStartTime && isActive) {
      const elapsedSeconds = Math.floor((currentTime - parseInt(savedStartTime)) / 1000);
      const remainingTime = (initialMinutes * 60) - elapsedSeconds;
      
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setStartTime(parseInt(savedStartTime));
      } else {
        // Vaqt tugagan
        setTimeLeft(0);
        onTimeUp && onTimeUp();
      }
    } else if (isActive && !savedStartTime) {
      // Yangi test boshlash
      const newStartTime = currentTime;
      setStartTime(newStartTime);
      localStorage.setItem(START_TIME_KEY, newStartTime.toString());
      setTimeLeft(initialMinutes * 60);
    }
  }, [initialMinutes, onTimeUp, isActive]);

  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          
          // LocalStorage'ga yangilangan vaqtni saqlash
          localStorage.setItem(TIMER_KEY, newTime.toString());
          
          if (newTime <= 0) {
            setIsRunning(false);
            // Test tugaganda localStorage'ni tozalash
            localStorage.removeItem(TIMER_KEY);
            localStorage.removeItem(START_TIME_KEY);
            onTimeUp && onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onTimeUp]);

  // Test yakunlanganda yoki component unmount bo'lganda localStorage tozalash
  useEffect(() => {
    return () => {
      if (timeLeft <= 0) {
        localStorage.removeItem(TIMER_KEY);
        localStorage.removeItem(START_TIME_KEY);
      }
    };
  }, [timeLeft]);

  // Vaqtni format qilish (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer klassini aniqlash
  const getTimerClass = () => {
    if (timeLeft <= 60) return 'timer danger'; // oxirgi 1 daqiqa
    if (timeLeft <= 180) return 'timer warning'; // oxirgi 3 daqiqa
    return 'timer';
  };

  return (
    <div className={getTimerClass()}>
      <svg style={{width: '1.25rem', height: '1.25rem'}} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8z"/>
      </svg>
      <span>
        {formatTime(timeLeft)}
      </span>
      {timeLeft <= 60 && timeLeft > 0 && (
        <span className="text-sm">
          Time running out!
        </span>
      )}
    </div>
  );
};

export default Timer;