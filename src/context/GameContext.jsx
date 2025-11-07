/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { gameReducer, initialGameState } from "./gameReducer";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      if (savedData.categories) {
        dispatch({ type: "SET_CATEGORIES", payload: savedData.categories });
      }
      if (savedData.questions) {
        dispatch({ type: "SET_QUESTIONS", payload: savedData.questions });
      }
      if (savedData.tiebreakers) {
        dispatch({ type: "SET_TIEBREAKERS", payload: savedData.tiebreakers });
      }
      if (savedData.gameStats) {
        dispatch({ type: "UPDATE_GAME_STATS", payload: savedData.gameStats });
      }
      if (savedData.settings) {
        dispatch({ type: "UPDATE_SETTINGS", payload: savedData.settings });
      }
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    const dataToSave = {
      categories: state.categories,
      questions: state.questions,
      tiebreakers: state.tiebreakers,
      gameStats: state.gameStats,
      settings: state.settings,
    };
    saveToLocalStorage(dataToSave);
  }, [
    state.categories,
    state.questions,
    state.tiebreakers,
    state.gameStats,
    state.settings,
  ]);

  const value = {
    state,
    dispatch,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
