// components/screens/TiebreakerScreen.jsx
import React, { useState, useEffect } from "react";
import { Zap, X, CheckCircle, AlertCircle, Trophy, Users } from "lucide-react";
import { useGame } from "../../context/GameContext";
import GameTimer from "../common/GameTimer";
import { getRandomQuestion } from "../../utils/dataService";

const TiebreakerScreen = () => {
  const { state, dispatch } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Load tiebreaker questions on mount
  useEffect(() => {
    if (state.tiebreakerQuestions.length === 0) {
      dispatch({ type: "START_TIEBREAKER" });
    }
  }, [dispatch, state.tiebreakerQuestions.length]);

  const getAvailableTiebreakers = () => {
    return state.tiebreakerQuestions.filter(
      (q) => !state.usedTiebreakers.includes(q.id)
    );
  };

  const handleQuestionSelect = (question) => {
    dispatch({ type: "SET_TIEBREAKER_QUESTION", payload: question });
    dispatch({ type: "SET_TIMER", payload: state.settings.tiebreakerTimer });
    dispatch({ type: "SET_TIMER_ACTIVE", payload: true });
    setSelectedAnswer(null);
  };

  const handleRandomQuestion = () => {
    const availableQuestions = getAvailableTiebreakers();
    const question = getRandomQuestion(availableQuestions);
    if (question) {
      handleQuestionSelect(question);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    dispatch({ type: "SET_TIMER_ACTIVE", payload: false });
    dispatch({ type: "SHOW_ANSWER" });

    if (answerIndex === state.currentQuestion.correct) {
      dispatch({ type: "UPDATE_SCORE", payload: 1 });
      dispatch({ type: "SET_CELEBRATION", payload: "⚡" });
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
    dispatch({
      type: "ADD_USED_TIEBREAKER",
      payload: state.currentQuestion.id,
    });
    dispatch({ type: "SWITCH_TURN" });
    dispatch({ type: "SET_CURRENT_QUESTION", payload: null });
    setSelectedAnswer(null);
  };

  const handleShowResults = () => {
    dispatch({ type: "SHOW_RESULTS" });
    dispatch({ type: "SET_SCREEN", payload: "results" });
  };

  const handleEndTiebreaker = () => {
    dispatch({ type: "RESET_TIEBREAKER" });
    handleShowResults();
  };

  // Question selection view
  if (!state.currentQuestion) {
    const availableQuestions = getAvailableTiebreakers();
    const allTiebreakersUsed = availableQuestions.length === 0;

    return (
      <div className="fade-in">
        <div className="container" style={{ paddingTop: "40px" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
              color: "white",
            }}
          >
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
                <h2>⚡ الجولة الفاصلة - TIEBREAKER ROUND</h2>
                <div
                  className={`team-indicator ${
                    state.currentTeam === 2 ? "team2" : ""
                  }`}
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <Zap size={20} />
                  {state.teams[`team${state.currentTeam}`].name}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn"
                  onClick={handleShowResults}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  <Trophy size={20} />
                  عرض النتائج
                </button>
                <button
                  className="btn"
                  onClick={handleEndTiebreaker}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  <X size={20} />
                  إنهاء الجولة الفاصلة
                </button>
              </div>
            </div>

            {/* Current Scores */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                marginBottom: "30px",
                background: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "15px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {state.teams.team1.score}
                </div>
                <div>{state.teams.team1.name}</div>
              </div>
              <div style={{ fontSize: "2rem", color: "white" }}>VS</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {state.teams.team2.score}
                </div>
                <div>{state.teams.team2.name}</div>
              </div>
            </div>

            {/* Question Selection */}
            {allTiebreakersUsed ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <h3>انتهت أسئلة الجولة الفاصلة</h3>
                <p>All tiebreaker questions have been used</p>
                <button
                  className="btn"
                  onClick={handleShowResults}
                  style={{
                    marginTop: "20px",
                    background: "white",
                    color: "#dc3545",
                  }}
                >
                  <Trophy size={20} />
                  عرض النتائج النهائية
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: "30px", textAlign: "center" }}>
                  اختر رقم السؤال - Choose Question Number
                </h3>

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <button
                    className="btn"
                    onClick={handleRandomQuestion}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: "#dc3545",
                      fontSize: "1.1rem",
                      padding: "15px 30px",
                    }}
                  >
                    <Zap size={20} />
                    سؤال عشوائي - Random Question
                  </button>
                </div>

                <div className="grid grid-4">
                  {availableQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="category-card"
                      onClick={() => handleQuestionSelect(question)}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: "#dc3545",
                        border: "3px solid white",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          marginBottom: "10px",
                          color: "#dc3545",
                        }}
                      >
                        {index + 1}
                      </div>
                      <Zap size={24} style={{ color: "#dc3545" }} />
                    </div>
                  ))}
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
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
            color: "white",
          }}
        >
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
              <h3>⚡ {state.teams[`team${state.currentTeam}`].name}</h3>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Zap size={20} />
                Tiebreaker Round
              </div>
            </div>

            <GameTimer />
          </div>

          {/* Question */}
          <div
            className="question-card"
            style={{ background: "rgba(255,255,255,0.95)", color: "#dc3545" }}
          >
            <div className="question-text" style={{ color: "#dc3545" }}>
              {state.currentQuestion.question}
            </div>
            <p style={{ opacity: 0.7, marginBottom: "30px" }}>
              {state.currentQuestion.questionEn}
            </p>

            <div className="options-grid">
              {state.currentQuestion.options.map((option, index) => {
                let className = "option-btn";
                let style = { borderColor: "#dc3545", color: "#dc3545" };

                if (state.showAnswer) {
                  if (index === state.currentQuestion.correct) {
                    className += " option-correct";
                    style = {};
                  } else if (selectedAnswer === index) {
                    className += " option-wrong";
                    style = {};
                  }
                }

                return (
                  <div
                    key={index}
                    className={className}
                    style={style}
                    onClick={() => handleAnswerSelect(index)}
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
            <div
              className="alert alert-info fade-in"
              style={{ background: "rgba(255,255,255,0.9)", color: "#333" }}
            >
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
                style={{
                  fontSize: "1.1rem",
                  padding: "15px 40px",
                  background: "rgba(255,255,255,0.9)",
                  color: "#dc3545",
                }}
              >
                الدور التالي - Next Turn
              </button>
            </div>
          )}

          {/* Result message */}
          {selectedAnswer !== null && (
            <div className="text-center fade-in" style={{ marginTop: "20px" }}>
              {selectedAnswer === state.currentQuestion.correct ? (
                <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                  ماشاء الله! إجابة صحيحة ⚡
                  <br />
                  <span style={{ fontSize: "1rem" }}>
                    Excellent! Correct answer!
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
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

export default TiebreakerScreen;
