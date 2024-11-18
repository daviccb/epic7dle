import React, { useState, useEffect } from 'react';
import { toZonedTime } from 'date-fns-tz';
import './Countdown.css';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  // Function to calculate the time left until next reset at 4:00 PM PST
  const calculateTimeLeft = () => {
    const now = new Date();
    const timeZone = 'America/Los_Angeles';

    // Create the next reset time at 4:00 PM PST today or tomorrow
    let resetTimePST = toZonedTime(new Date(), timeZone);
    resetTimePST.setHours(16, 0, 0, 0); // Set to 4:00 PM PST (16:00)

    // If the reset time has already passed today, set to tomorrow at 4:00 PM PST
    if (now > resetTimePST) {
      resetTimePST.setDate(resetTimePST.getDate() + 1);
    }

    // Calculate the difference in milliseconds
    const difference = resetTimePST - now;

    // Calculate hours, minutes, and seconds left
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // Format as HH:MM:SS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Initialize the timer
    setTimeLeft(calculateTimeLeft());

    // Update the timer every second
    const timerId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the interval when component unmounts
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="countdown-timer">
      <h2 className='timertext'>Time till next game:</h2>
      <h2 className='timertime'>{timeLeft}</h2>
    </div>
  );
}

export default CountdownTimer;
