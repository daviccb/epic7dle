import React, { useState, useEffect } from 'react';
import './Countdown.css';

function CountdownTimer({ onCountdownComplete }) {
  const [timeLeft, setTimeLeft] = useState('');

  // Function to calculate the time left until next reset at 4:00 PM PST
  const calculateTimeLeft = () => {
    const now = new Date();

    // Get the current time in UTC
    const nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
      now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    // Create the next reset time at 00:00 UTC today or tomorrow
    let resetTimeUTC = new Date(nowUTC); // Clone the current UTC date and time
    resetTimeUTC.setUTCHours(7, 0, 0, 0); // Set to 00:00 UTC

    // If the reset time has already passed today, set to tomorrow at 00:00 UTC
    if (nowUTC >= resetTimeUTC) {
      resetTimeUTC.setUTCDate(resetTimeUTC.getUTCDate() + 1);
    }

    // Calculate the difference in milliseconds
    const difference = resetTimeUTC - nowUTC;

    // Calculate hours, minutes, and seconds left
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Format as HH:MM:SS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if the countdown has reached zero
      if (newTimeLeft === "00:00:00") {
        onCountdownComplete();
      }
    };

    // Initialize the timer and update every second
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    // Clean up the interval when component unmounts
    return () => clearInterval(timerId);
  }, [onCountdownComplete]);

  return (
    <div className="countdown-timer">
      <h2 className='timertext'>Time till next game:</h2>
      <h2 className='timertime'>{timeLeft}</h2>
    </div>
  );
}

export default CountdownTimer;
