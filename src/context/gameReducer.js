/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import { mockData } from "../data/mockData";

export const initialGameState = {
  currentScreen: "home",
  teams: {
    team1: { name: "", score: 0 },
    team2: { name: "", score: 0 },
  },
  currentTeam: 1,
  selectedCategory: null,
  currentQuestion: null,
  usedQuestions: [],
  timeLeft: 120,
  timerActive: false,
  gameEnded: false,
  showAnswer: false,
  showExplanation: false,
  categories: mockData.categories,
  questions: mockData.questions,
  tiebreakers: mockData.tiebreakers,
  adminUser: null,
  settings: {
    normalTimer: 120,
    tiebreakerTimer: 60,
    language: "ar",
    soundEnabled: true,
  },
  celebration: null,
  isTiebreaker: false,
  tiebreakerQuestions: [],
  usedTiebreakers: [],
  gameStats: {
    totalGames: 0,
    team1Wins: 0,
    team2Wins: 0,
    ties: 0,
  },
  showResults: false,
};

export function gameReducer(state, action) {
  let newTeams;
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, currentScreen: action.payload };

    case "SET_TEAMS":
      return { ...state, teams: action.payload };

    case "SET_CURRENT_TEAM":
      return { ...state, currentTeam: action.payload };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };

    case "SET_TIEBREAKERS":
      return { ...state, tiebreakers: action.payload };

    case "SET_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        showAnswer: false,
        showExplanation: false,
      };

    case "ADD_USED_QUESTION":
      return {
        ...state,
        usedQuestions: [...state.usedQuestions, action.payload],
      };

    case "UPDATE_SCORE":
      newTeams = { ...state.teams };
      newTeams[`team${state.currentTeam}`].score += action.payload;
      return { ...state, teams: newTeams };

    case "SET_TIMER":
      return { ...state, timeLeft: action.payload };

    case "SET_TIMER_ACTIVE":
      return { ...state, timerActive: action.payload };

    case "SHOW_ANSWER":
      return { ...state, showAnswer: true };

    case "SHOW_EXPLANATION":
      return { ...state, showExplanation: true };

    case "SWITCH_TURN":
      return { ...state, currentTeam: state.currentTeam === 1 ? 2 : 1 };

    case "END_GAME":
      return { ...state, gameEnded: true, timerActive: false };

    case "SHOW_RESULTS":
      return { ...state, showResults: true };

    case "RESET_GAME":
      return {
        ...initialGameState,
        categories: state.categories,
        questions: state.questions,
        tiebreakers: state.tiebreakers,
        adminUser: state.adminUser,
        settings: state.settings,
        gameStats: state.gameStats,
        currentScreen: "home",
      };

    case "SET_ADMIN_USER":
      return { ...state, adminUser: action.payload };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case "SET_CELEBRATION":
      return { ...state, celebration: action.payload };

    case "START_TIEBREAKER":
      return {
        ...state,
        isTiebreaker: true,
        tiebreakerQuestions: Object.values(state.tiebreakers),
        usedTiebreakers: [],
        currentQuestion: null,
        showResults: false,
      };

    case "SET_TIEBREAKER_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        showAnswer: false,
        showExplanation: false,
      };

    case "ADD_USED_TIEBREAKER":
      return {
        ...state,
        usedTiebreakers: [...state.usedTiebreakers, action.payload],
      };

    case "UPDATE_GAME_STATS":
      return { ...state, gameStats: { ...state.gameStats, ...action.payload } };

    case "RESET_TIEBREAKER":
      return {
        ...state,
        isTiebreaker: false,
        usedTiebreakers: [],
        tiebreakerQuestions: [],
        showResults: false,
      };

    // CRUD Operations
    case "ADD_CATEGORY":
      const newCategoryId = action.payload.id || Date.now().toString();
      return {
        ...state,
        categories: {
          ...state.categories,
          [newCategoryId]: { ...action.payload, id: newCategoryId },
        },
      };

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.id]: action.payload,
        },
      };

    case "DELETE_CATEGORY":
      const { [action.payload]: deletedCategory, ...remainingCategories } =
        state.categories;
      return {
        ...state,
        categories: remainingCategories,
      };

    case "ADD_QUESTION":
      const newQuestionId = action.payload.id || Date.now().toString();
      return {
        ...state,
        questions: {
          ...state.questions,
          [newQuestionId]: { ...action.payload, id: newQuestionId },
        },
      };

    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.payload.id]: action.payload,
        },
      };

    case "DELETE_QUESTION":
      const { [action.payload]: deletedQuestion, ...remainingQuestions } =
        state.questions;
      return {
        ...state,
        questions: remainingQuestions,
      };

    case "ADD_TIEBREAKER":
      const newTiebreakerId = action.payload.id || Date.now().toString();
      return {
        ...state,
        tiebreakers: {
          ...state.tiebreakers,
          [newTiebreakerId]: { ...action.payload, id: newTiebreakerId },
        },
      };

    case "UPDATE_TIEBREAKER":
      return {
        ...state,
        tiebreakers: {
          ...state.tiebreakers,
          [action.payload.id]: action.payload,
        },
      };

    case "DELETE_TIEBREAKER":
      const { [action.payload]: deletedTiebreaker, ...remainingTiebreakers } =
        state.tiebreakers;
      return {
        ...state,
        tiebreakers: remainingTiebreakers,
      };

    default:
      return state;
  }
}
