/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Trophy,
  BookOpen,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import GameTimer from "../common/GameTimer";
import {
  getAvailableQuestions,
  getRandomQuestion,
} from "../../utils/dataService";

const GameScreen = () => {
  const { state, dispatch } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const language = state.settings.language || "ckb";

  // Check if we're in tournament mode
  const isTournamentMode = !!state.currentTournamentGame;
  const tournamentQuestionIds = state.currentTournamentGame?.questionIds || [];

  const getAvailableQuestionsForCategory = (categoryId) => {
    let availableQuestions = getAvailableQuestions(
      state.questions,
      categoryId,
      state.usedQuestions
    );

    // If in tournament mode, filter to only assigned questions
    if (isTournamentMode && tournamentQuestionIds.length > 0) {
      availableQuestions = availableQuestions.filter(q =>
        tournamentQuestionIds.includes(q.id)
      );
    }

    return availableQuestions;
  };

  const handleCategorySelect = (categoryId) => {
    const availableQuestions = getAvailableQuestionsForCategory(categoryId);
    if (availableQuestions.length === 0) return;

    const question = getRandomQuestion(availableQuestions);
    if (question) {
      dispatch({ type: "SET_CURRENT_QUESTION", payload: question });
      dispatch({ type: "SET_TIMER", payload: state.settings.normalTimer });
      dispatch({ type: "SET_TIMER_ACTIVE", payload: true });
      setSelectedAnswer(null);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    dispatch({ type: "SET_TIMER_ACTIVE", payload: false });
    dispatch({ type: "SHOW_ANSWER" });

    if (answerIndex === state.currentQuestion.correct) {
      dispatch({ type: "UPDATE_SCORE", payload: 1 });
      // Celebration animations removed as per requirements
    } else {
      setTimeout(() => {
        dispatch({ type: "SHOW_EXPLANATION" });
      }, 1500);
    }
  };

  const handleNextTurn = () => {
    dispatch({ type: "ADD_USED_QUESTION", payload: state.currentQuestion.id });
    dispatch({ type: "SWITCH_TURN" });
    dispatch({ type: "SET_CURRENT_QUESTION", payload: null });
    setSelectedAnswer(null);
  };

  const handleShowResults = () => {
    // If in tournament mode, record the game results
    if (isTournamentMode && state.currentTournamentGame) {
      const team1Score = state.teams.team1.score;
      const team2Score = state.teams.team2.score;
      const winner = team1Score > team2Score ? "groupA" : team1Score < team2Score ? "groupB" : null;

      dispatch({
        type: "UPDATE_TOURNAMENT_GAME",
        payload: {
          tournamentId: state.currentTournamentGame.tournamentId,
          phaseId: state.currentTournamentGame.phaseId,
          gameId: state.currentTournamentGame.gameId,
          gameData: {
            status: "completed",
            groupAScore: team1Score,
            groupBScore: team2Score,
            winner: winner,
          },
        },
      });
    }

    dispatch({ type: "SHOW_RESULTS" });
    dispatch({ type: "SET_SCREEN", payload: "results" });
  };

  const handleEndGame = () => {
    dispatch({ type: "END_GAME" });
    handleShowResults();
  };

  // Check if all questions are used
  const totalQuestions = Object.keys(state.questions).length;
  const allQuestionsUsed = state.usedQuestions.length >= totalQuestions;

  // Category selection view
  if (!state.currentQuestion) {
    return (
      <div className="fade-in">
        <div className="container" style={{ paddingTop: "40px" }}>
          <div className="card">
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <div>
                <h2>
                  دور الفريق: {state.teams[`team${state.currentTeam}`].name}
                </h2>
                <div
                  className={`team-indicator ${
                    state.currentTeam === 2 ? "team2" : ""
                  }`}
                >
                  <Users size={20} />
                  Team {state.currentTeam} Turn
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleShowResults}
                >
                  <Trophy size={20} />
                  عرض النتائج
                </button>
                <button className="btn btn-danger" onClick={handleEndGame}>
                  <X size={20} />
                  إنهاء المسابقة
                </button>
              </div>
            </div>

            {/* Score Display */}
            <div className="score-display" style={{ marginBottom: "30px" }}>
              <div className="score-card">
                <h3>{state.teams.team1.name}</h3>
                <div className="score-number">{state.teams.team1.score}</div>
              </div>
              <div className="score-card team2">
                <h3>{state.teams.team2.name}</h3>
                <div className="score-number">{state.teams.team2.score}</div>
              </div>
            </div>

            {/* Categories Grid */}
            {allQuestionsUsed ? (
              <div className="text-center" style={{ padding: "40px" }}>
                <h3>انتهت جميع الأسئلة!</h3>
                <p>
                  All questions have been used. Click "Show Results" to see the
                  final scores.
                </p>
                <button
                  className="btn"
                  onClick={handleShowResults}
                  style={{ marginTop: "20px" }}
                >
                  <Trophy size={20} />
                  عرض النتائج النهائية
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: "30px", textAlign: "center" }}>
                  {language === "ckb"
                    ? "پۆلێک هەڵبژێرە"
                    : "اختر التصنيف"}
                </h3>

                <div className="grid grid-3">
                  {Object.entries(state.categories).map(([id, category]) => {
                    const availableQuestions =
                      getAvailableQuestionsForCategory(id);

                    // Calculate total based on tournament mode or regular mode
                    let totalQuestions;
                    if (isTournamentMode && tournamentQuestionIds.length > 0) {
                      totalQuestions = Object.values(state.questions).filter(
                        (q) => q.category === id && tournamentQuestionIds.includes(q.id)
                      ).length;
                    } else {
                      totalQuestions = Object.values(state.questions).filter(
                        (q) => q.category === id
                      ).length;
                    }

                    const usedCount = totalQuestions - availableQuestions.length;

                    return (
                      <div
                        key={id}
                        className={`category-card ${
                          availableQuestions.length === 0 ? "disabled" : ""
                        }`}
                        onClick={() =>
                          availableQuestions.length > 0 &&
                          handleCategorySelect(id)
                        }
                      >
                        <div className="category-icon">
                          <BookOpen size={24} />
                        </div>
                        <h4 style={{ margin: "15px 0 10px" }}>
                          {language === "ckb"
                            ? category.nameCkb || category.name
                            : category.name}
                        </h4>
                        <p
                          style={{
                            fontSize: "14px",
                            opacity: 0.7,
                            marginBottom: "10px",
                          }}
                        >
                          {language === "ckb"
                            ? category.name
                            : category.nameCkb || category.name}
                        </p>
                        <div
                          style={{
                            background:
                              availableQuestions.length > 0
                                ? "#28a745"
                                : "#6c757d",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            display: "inline-block",
                          }}
                        >
                          {usedCount}/{totalQuestions}
                        </div>
                        <p style={{ fontSize: "12px", marginTop: "10px" }}>
                          {availableQuestions.length}{" "}
                          {language === "ckb" ? "ماوە" : "متبقية"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Question view
  return (
    <div className="fade-in">
      <div className="container" style={{ paddingTop: "40px" }}>
        <div className="card">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div>
              <h3>{state.teams[`team${state.currentTeam}`].name}</h3>
              <div
                className={`team-indicator ${
                  state.currentTeam === 2 ? "team2" : ""
                }`}
              >
                <Users size={20} />
                Team {state.currentTeam}
              </div>
            </div>

            <GameTimer />
          </div>

          {/* Question */}
          <div className="question-card">
            <div className="question-text">
              {/* Always show Arabic for Quran and Hadith, otherwise respect language setting */}
              {state.currentQuestion.category === "quran" ||
              state.currentQuestion.category === "hadith"
                ? state.currentQuestion.question
                : language === "ckb"
                ? state.currentQuestion.questionCkb || state.currentQuestion.question
                : state.currentQuestion.question}
            </div>
            {/* Show secondary language if not Quran/Hadith */}
            {state.currentQuestion.category !== "quran" &&
              state.currentQuestion.category !== "hadith" && (
                <p style={{ opacity: 0.7, marginBottom: "30px" }}>
                  {language === "ckb"
                    ? state.currentQuestion.question
                    : state.currentQuestion.questionCkb || state.currentQuestion.question}
                </p>
              )}

            <div className="options-grid">
              {(language === "ckb"
                ? state.currentQuestion.optionsCkb || state.currentQuestion.options
                : state.currentQuestion.options
              ).map((option, index) => {
                let className = "option-btn";
                if (state.showAnswer) {
                  if (index === state.currentQuestion.correct) {
                    className += " option-correct";
                  } else if (selectedAnswer === index) {
                    className += " option-wrong";
                  }
                }

                // Get secondary language option
                const secondaryOption =
                  language === "ckb"
                    ? state.currentQuestion.options[index]
                    : state.currentQuestion.optionsCkb?.[index] || state.currentQuestion.options[index];

                return (
                  <div
                    key={index}
                    className={className}
                    onClick={() => handleAnswerSelect(index)}
                    style={{
                      cursor: selectedAnswer === null ? "pointer" : "default",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        {option}
                      </div>
                      {/* Don't show secondary language for Quran/Hadith options */}
                      {state.currentQuestion.category !== "quran" &&
                        state.currentQuestion.category !== "hadith" && (
                          <div style={{ fontSize: "14px", opacity: 0.8 }}>
                            {secondaryOption}
                          </div>
                        )}
                    </div>
                    {state.showAnswer &&
                      index === state.currentQuestion.correct && (
                        <CheckCircle size={20} style={{ marginLeft: "10px" }} />
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {state.showExplanation && state.currentQuestion.explanation && (
            <div className="alert alert-info fade-in">
              <AlertCircle size={20} />
              <div>
                <strong>{language === "ckb" ? "ڕوونکردنەوە:" : "التفسير:"}</strong>{" "}
                {language === "ckb"
                  ? state.currentQuestion.explanationCkb || state.currentQuestion.explanation
                  : state.currentQuestion.explanation}
                {state.currentQuestion.category !== "quran" &&
                  state.currentQuestion.category !== "hadith" && (
                    <>
                      <br />
                      <strong>
                        {language === "ckb" ? "التفسير:" : "ڕوونکردنەوە:"}
                      </strong>{" "}
                      {language === "ckb"
                        ? state.currentQuestion.explanation
                        : state.currentQuestion.explanationCkb || state.currentQuestion.explanation}
                    </>
                  )}
              </div>
            </div>
          )}

          {/* Actions */}
          {selectedAnswer !== null && (
            <div className="text-center" style={{ marginTop: "30px" }}>
              <button
                className="btn"
                onClick={handleNextTurn}
                style={{ fontSize: "1.1rem", padding: "15px 40px" }}
              >
                الدور التالي - Next Turn
              </button>
            </div>
          )}

          {/* Result message */}
          {selectedAnswer !== null && (
            <div className="text-center fade-in" style={{ marginTop: "20px" }}>
              {selectedAnswer === state.currentQuestion.correct ? (
                <div
                  style={{
                    color: "#28a745",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  ماشاء الله! إجابة صحيحة ✨
                  <br />
                  <span style={{ fontSize: "1rem" }}>
                    Excellent! Correct answer!
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    color: "#dc3545",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  لا بأس، إن شاء الله المرة القادمة 🤲
                  <br />
                  <span style={{ fontSize: "1rem" }}>
                    No worries, better luck next time!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Celebration removed as per requirements */}
    </div>
  );
};

export default GameScreen;
