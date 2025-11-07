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

  const getAvailableQuestionsForCategory = (categoryId) => {
    return getAvailableQuestions(
      state.questions,
      categoryId,
      state.usedQuestions
    );
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
      dispatch({ type: "SET_CELEBRATION", payload: "🎉" });
      setTimeout(
        () => dispatch({ type: "SET_CELEBRATION", payload: null }),
        2000
      );
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
                  اختر التصنيف - Choose Category
                </h3>

                <div className="grid grid-3">
                  {Object.entries(state.categories).map(([id, category]) => {
                    const availableQuestions =
                      getAvailableQuestionsForCategory(id);
                    const totalQuestions = Object.values(
                      state.questions
                    ).filter((q) => q.category === id).length;
                    const usedCount =
                      totalQuestions - availableQuestions.length;

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
                          {category.name}
                        </h4>
                        <p
                          style={{
                            fontSize: "14px",
                            opacity: 0.7,
                            marginBottom: "10px",
                          }}
                        >
                          {category.nameEn}
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
                          {availableQuestions.length} متبقية
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
              {state.currentQuestion.question}
            </div>
            <p style={{ opacity: 0.7, marginBottom: "30px" }}>
              {state.currentQuestion.questionEn}
            </p>

            <div className="options-grid">
              {state.currentQuestion.options.map((option, index) => {
                let className = "option-btn";
                if (state.showAnswer) {
                  if (index === state.currentQuestion.correct) {
                    className += " option-correct";
                  } else if (selectedAnswer === index) {
                    className += " option-wrong";
                  }
                }

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
                      <div style={{ fontSize: "14px", opacity: 0.8 }}>
                        {state.currentQuestion.optionsEn[index]}
                      </div>
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
                <strong>التفسير:</strong> {state.currentQuestion.explanation}
                {state.currentQuestion.explanationEn && (
                  <>
                    <br />
                    <strong>Explanation:</strong>{" "}
                    {state.currentQuestion.explanationEn}
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

      {/* Celebration */}
      {state.celebration && (
        <div className="celebration">{state.celebration}</div>
      )}
    </div>
  );
};

export default GameScreen;
