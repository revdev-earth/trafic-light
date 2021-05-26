import React, { useState, useCallback, useEffect, useRef } from 'react'
import './styles.css'

function useInput({ defaultValue }) {
  const [value, setValue] = useState(defaultValue)
  const input = (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      type='number'
      min='1'
      max='60'
    />
  )
  return [value, input]
}

export default function TrafficLight() {
  const timer = useRef(0)
  const interval = useRef(0)
  const [background, setBackground] = useState('green')
  const [greenNumber, greenInput] = useInput({
    type: 'number',
    defaultValue: 9
  })
  const [orangeNumber, orangeInput] = useInput({
    type: 'number',
    defaultValue: 3
  })
  const [redNumber, redInput] = useInput({ defaultValue: 9 })

  const [time, setTime] = useState(-1)
  const [isActive, activeSystem] = useState(false)
  const [inputChanged, setInputChanged] = useState(false)
  const [isOrangeActive, activeOrange] = useState(false)

  // Orange times
  useEffect(() => {
    if (time === Number(orangeNumber)) activeOrange(true)
  }, [orangeNumber, time])

  // updateTime when input change
  useEffect(() => {
    inputChanged && setTime(background === 'green' ? redNumber : greenNumber)
  }, [background, greenNumber, inputChanged, redNumber])

  // input was updated
  useEffect(() => {
    activeSystem(false)
    clearInterval(timer.current)
    setInputChanged(true)
  }, [greenNumber, redNumber])

  // setTime Callback
  const setTimeCallback = useCallback(() => {
    const selectTime = background === 'green' ? redNumber : greenNumber
    setTime(selectTime)
  }, [background, greenNumber, redNumber])

  // change color
  useEffect(() => {
    if (time === 0) {
      const selectColor = background === 'green' ? 'red' : 'green'
      activeOrange(false)
      setTimeCallback()
      setBackground(selectColor)
      activeOrange(false)
    }
  }, [background, setTimeCallback, time])

  // still active
  useEffect(() => {
    if (isActive) {
      interval.current = setInterval(() => {
        setTime(lastState => lastState - 1)
      }, 1000)
    }
  }, [isActive])

  function start() {
    activeSystem(true)
    setTimeCallback()
  }

  function pause() {
    activeSystem(false)
    clearInterval(interval.current)
  }

  function stop() {
    clearInterval(interval.current)
    activeOrange(false)
    activeSystem(false)
    setTime(-1)
  }

  return (
    <div className='container'>
      <div className='traffic-light'>
        <div
          className='circle'
          style={{ background: background === 'red' && 'red' }}></div>
        <div
          className='circle'
          style={{ background: isOrangeActive && 'orange' }}></div>
        <div
          className='circle'
          style={{ background: background === 'green' && 'green' }}></div>
      </div>

      <div className='configurable'>
        <div>
          <h3>Timer: {time}</h3>
        </div>

        <div className='fields'>
          <h3>Times:</h3>
          <div className='field'>
            <label>Red: </label>
            {greenInput}
          </div>
          <div className='field'>
            <label>Orange: </label>
            {orangeInput}
          </div>
          <div className='field'>
            <label>Green: </label>
            {redInput}
          </div>
        </div>

        <div className='buttons'>
          <h3>Buttons:</h3>
          <button onClick={() => start()}>Start</button>
          <button onClick={() => pause()}>Pause</button>
          <button onClick={() => stop()}>Stop</button>
        </div>
      </div>
    </div>
  )
}
