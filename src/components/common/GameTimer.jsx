// components/common/GameTimer.jsx
import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { useGame } from "../../context/GameContext";

const GameTimer = () => {
  const { state, dispatch } = useGame();
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    let interval;
    if (state.timerActive && state.timeLeft > 0) {
      interval = setInterval(() => {
        const newTime = state.timeLeft - 1;
        dispatch({ type: "SET_TIMER", payload: newTime });

        // Sound warning at 30 seconds
        if (newTime === 30 && !hasWarned) {
          setHasWarned(true);
          // You can add sound here if needed
        }
      }, 1000);
    } else if (state.timeLeft === 0 && state.timerActive) {
      dispatch({ type: "SET_TIMER_ACTIVE", payload: false });
      setHasWarned(false);
    }
    return () => clearInterval(interval);
  }, [state.timerActive, state.timeLeft, dispatch, hasWarned]);

  // Reset warning when timer resets
  useEffect(() => {
    if (state.timeLeft > 30) {
      setHasWarned(false);
    }
  }, [state.timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timerLimit = state.isTiebreaker
    ? state.settings.tiebreakerTimer
    : state.settings.normalTimer;
  const percentage = (state.timeLeft / timerLimit) * 100;

  return (
    <div className="timer-circle">
      <div className="timer-inner">
        <Timer size={24} />
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          {formatTime(state.timeLeft)}
        </div>
      </div>
      <svg
        style={{
          position: "absolute",
          width: "120px",
          height: "120px",
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={state.timeLeft > 30 ? "#4a7c59" : "#dc3545"}
          strokeWidth="8"
          strokeDasharray={`${percentage * 3.14} 314`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default GameTimer;
