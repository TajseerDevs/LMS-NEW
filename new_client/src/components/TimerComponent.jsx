import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const TimerComponent = ({ duration, onTimeUp , quizId }) => {

  const navigate = useNavigate()

  const initialTimeInSeconds =
    duration?.unit === 'hours'
      ? duration?.value * 60 * 60
      : duration?.value * 60


  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`timer-time-left-${quizId}`)
    return savedTime ? parseInt(savedTime, 10) : initialTimeInSeconds
  })


  useEffect(() => {

    localStorage.setItem(`timer-time-left-${quizId}`, timeLeft)

    if (timeLeft <= 0) {

      // function that runs when time finished
      if (onTimeUp) {
        onTimeUp()

      }

      return

    }

    const intervalId = setInterval(() => {

      setTimeLeft((prevTime) => {

        if (prevTime <= 0) {
          clearInterval(intervalId)
          return 0
        }

        return prevTime - 1

      })

    }, 1000)

    return () => clearInterval(intervalId)

  }, [timeLeft, onTimeUp])


  const formatTime = (seconds) => {

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`

  }

  return (

    <h1 className="text-md capitalize text-[#002147] font-bold">
      <span className="text-[#000000]">{formatTime(timeLeft)}</span>
    </h1>

  )

}


export default TimerComponent
