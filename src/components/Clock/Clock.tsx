import React, { useEffect, useRef, useState } from "react";
import "./Clock.css";
import { useClockSettings } from "../../hooks/useSettings";

const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const Clock: React.FC = () => {
  const { clockSettings } = useClockSettings();

  const computeTime = (timezone: string | number) => {
    const now = new Date();
    const timezoneOffset =
      typeof timezone === "string"
        ? parseFloat(timezone)
        : timezone || 0;
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + timezoneOffset * 3600 * 1000);
  };
  const [time, setTime] = useState(computeTime(clockSettings.timezone));
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateTime = () => setTime(computeTime(clockSettings.timezone));
    updateTime();
    timerRef.current = window.setInterval(updateTime, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [clockSettings.timezone]);


  const currentDay = time.getDay();

  if (!clockSettings.enable) {
    return null;
  }

  return (
    <div
      className={`clock-container text-center ${
        clockSettings.transparentBackground ? "transparent" : ""
      }`}
      style={{ width: '100%' }}
    >
      <div className="digital-clock">
        {time.toLocaleTimeString(clockSettings.locateCode, {
          hour12: clockSettings.hour12,
          hour: "2-digit",
          minute: "2-digit",
          second: clockSettings.showSeconds ? "2-digit" : undefined,
        })}
      </div>
      <div className="date">
        {time.toLocaleDateString(clockSettings.locateCode, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: clockSettings.showWeekdays ? "short" : undefined,
        })}
      </div>
      <div className="weekdays">
        {weekDays.map((day, index) => (
          <span key={day} className={`weekday${index === currentDay ? " active" : ""}`}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Clock;
