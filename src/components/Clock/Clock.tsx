import React, { useEffect, useRef, useState } from "react";
import "./Clock.css";

const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

type ClockProps = {
  timezone?: number;
  locateCode?: string;
  hour12?: boolean;
  showSeconds?: boolean;
  showWeekdays?: boolean;
  transparentBackground?: boolean;
};

const Clock: React.FC<ClockProps> = ({
  timezone = +7,
  locateCode = "vi-VN",
  hour12 = false,
  showSeconds = true,
  showWeekdays = false,
  transparentBackground = true,
}) => {
  const computeTime = () => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + timezone * 3600 * 1000);
  };
  const [time, setTime] = useState(computeTime);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateTime = () => setTime(computeTime());
    updateTime();
    timerRef.current = window.setInterval(updateTime, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentDay = time.getDay();

  return (
    <div className={`clock-container text-center ${transparentBackground ? "transparent" : ""}`}>
      <div className="digital-clock">
        {time.toLocaleTimeString(locateCode, {
          hour12: hour12,
          hour: "2-digit",
          minute: "2-digit",
          second: showSeconds ? "2-digit" : undefined,
        })}
      </div>
      <div className="date">
        {time.toLocaleDateString(locateCode, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          weekday: showWeekdays ? "short" : undefined,
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
