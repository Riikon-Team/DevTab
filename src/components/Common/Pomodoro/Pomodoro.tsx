import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Tooltip from '@mui/material/Tooltip';
import './Pomodoro.css';

const DEFAULT_WORK = 25 * 60; // 25 phút
const DEFAULT_BREAK = 5 * 60; // 5 phút

const Pomodoro: React.FC<{ enable?: boolean }> = ({ enable = true }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workTime, setWorkTime] = useState(DEFAULT_WORK);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const playSound = () => {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4b82.mp3');
    audio.play();
  };

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          playSound();
          if (!isBreak) {
            setIsBreak(true);
            setSecondsLeft(breakTime);
            setIsRunning(false);
          } else {
            setIsBreak(false);
            setSecondsLeft(workTime);
            setIsRunning(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reset = () => {
    pause();
    setIsBreak(false);
    setSecondsLeft(workTime);
  };

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(60, Number(e.target.value)));
    setWorkTime(val * 60);
    if (!isBreak) setSecondsLeft(val * 60);
  };
  const handleBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(30, Number(e.target.value)));
    setBreakTime(val * 60);
    if (isBreak) setSecondsLeft(val * 60);
  };

  if (!enable) return null;

  return (
    <div className="pomodoro-container">
      <h2>Pomodoro</h2>
      <div className="pomodoro-timer">{formatTime(secondsLeft)}</div>
      <div className="pomodoro-status">
        <span className={isBreak ? 'break' : 'work'}>
          {isBreak ? 'Break' : 'Work'}
        </span>
      </div>
      <div className="pomodoro-controls">
        <Tooltip title="Start">
          <span>
            <IconButton onClick={start} disabled={isRunning} color="inherit" size="large">
              <PlayArrowIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Pause">
          <span>
            <IconButton onClick={pause} disabled={!isRunning} color="inherit" size="large">
              <PauseIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Reset">
          <span>
            <IconButton onClick={reset} color="inherit" size="large">
              <RestartAltIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
      <div className="pomodoro-settings">
        <label>
          Work
          <input type="number" min={1} max={60} value={Math.floor(workTime/60)} onChange={handleWorkChange} /> min
        </label>
        <label>
          Break
          <input type="number" min={1} max={30} value={Math.floor(breakTime/60)} onChange={handleBreakChange} /> min
        </label>
      </div>
    </div>
  );
};

export default Pomodoro; 