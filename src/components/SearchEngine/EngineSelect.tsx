import React, { useState, useRef, useEffect } from "react";
import "./EngineSelect.css";

type Engine = {
  name: string;
  icon: string;
};

interface EngineSelectProps {
  engines: Engine[];
  value: number;
  onChange: (idx: number) => void;
}

const EngineSelect: React.FC<EngineSelectProps> = ({ engines, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!selectRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="engine-select-custom" ref={selectRef} tabIndex={0} onClick={() => setOpen((v) => !v)}>
      <img src={engines[value].icon} alt={engines[value].name} className="engine-icon" />
      {/* <span className="engine-name">{engines[value].name}</span> */}
      <span className="engine-caret">▼</span>
      {open && (
        <ul className="engine-dropdown">
          {engines.map((engine, idx) => (
            <li
              key={engine.name}
              className={value === idx ? "active" : ""}
              onMouseDown={() => {
                onChange(idx);
                setOpen(false);
              }}
            >
              <img src={engine.icon} alt={engine.name} className="engine-icon" />
              <span className="engine-name">{engine.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EngineSelect;