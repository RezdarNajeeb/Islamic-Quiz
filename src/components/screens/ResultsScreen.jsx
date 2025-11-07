// components/screens/ResultsScreen.jsx
import React, { useEffect, useState } from "react";
import { Trophy, RefreshCw, Home, Zap, Target, Users } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { calculateGameStats } from "../../utils/dataService";

const ResultsScreen = () => {
  const { state, dispatch } = useGame();
  const [statsUpdated, setStatsUpdated] = useState(false);

  const gameStats = calculateGameStats(state.teams);
  const { winner, isDraw, team1Score, team2Score } = gameStats;

  useEffect(() => {
    if (!statsUpdated) {
      if (winner) {
        dispatch({ type: "SET_CELEBRATION", payload: "🏆" });
        setTimeout(
          () => dispatch({ type: "SET_CELEBRATION", payload: null }),
          3000
        );

        // Update game statistics
        const stats = {
          totalGames: state.gameStats.totalGames + 1,
          [`team${winner}Wins`]: state.gameStats[`team${winner}Wins`] + 1,
        };
        dispatch({ type: "UPDATE_GAME_STATS", payload: stats });
        setStatsUpdated(true);
      } else if (isDraw) {
        // It's a tie, update tie statistics
        const stats = {
          totalGames: state.gameStats.totalGames + 1,
          ties: state.gameStats.ties + 1,
        };
        dispatch({ type: "UPDATE_GAME_STATS", payload: stats });
        setStatsUpdated(true);
      }
    }
  }, [winner, isDraw, statsUpdated, dispatch, state.gameStats]);

  const handleStartTiebreaker = () => {
    dispatch({ type: "START_TIEBREAKER" });
    dispatch({ type: "SET_SCREEN", payload: "tiebreaker" });
  };

  const handleNewGame = () => {
    dispatch({ type: "RESET_GAME" });
    setStatsUpdated(false);
  };

  const handleBackToHome = () => {
    dispatch({ type: "SET_SCREEN", payload: "home" });
    setStatsUpdated(false);
  };

  return (
    <div className="fade-in">
      <div className="container" style={{ paddingTop: "60px" }}>
        <div className="card text-center">
          <Trophy
            size={80}
            style={{ color: "#b8860b", marginBottom: "30px" }}
          />

          <h2 style={{ marginBottom: "10px" }}>نتائج المسابقة</h2>
          <h3 style={{ color: "#666", marginBottom: "40px" }}>
            Competition Results
          </h3>

          <div className="score-display">
            <div className={`score-card ${winner === 1 ? "winner" : ""}`}>
              <h3>{state.teams.team1.name}</h3>
              <div className="score-number">{team1Score}</div>
              {winner === 1 && (
                <div
                  style={{
                    background: "#ffd700",
                    color: "#b8860b",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  🏆 الفائز! Winner!
                </div>
              )}
            </div>

            <div className={`score-card ${winner === 2 ? "winner" : ""}`}>
              <h3>{state.teams.team2.name}</h3>
              <div className="score-number">{team2Score}</div>
              {winner === 2 && (
                <div
                  style={{
                    background: "#ffd700",
                    color: "#b8860b",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  🏆 الفائز! Winner!
                </div>
              )}
            </div>
          </div>

          {/* Tie situation */}
          {isDraw && !state.isTiebreaker && (
            <div className="alert alert-info" style={{ marginTop: "30px" }}>
              <div>
                <h4 style={{ marginBottom: "15px" }}>
                  🤝 تعادل! - It's a Tie!
                </h4>
                <p style={{ marginBottom: "20px" }}>
                  النتيجة متعادلة! يمكن إجراء جولة فاصلة لتحديد الفائز
                  <br />
                  The scores are tied! You can play a tiebreaker round to
                  determine the winner.
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={handleStartTiebreaker}
                  style={{ marginTop: "15px" }}
                >
                  <Zap size={20} />
                  ابدأ الجولة الفاصلة - Start Tiebreaker
                </button>
              </div>
            </div>
          )}

          {/* Islamic quote */}
          <div className="islamic-card" style={{ marginTop: "40px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "15px" }}>✨</div>
            <h4>"رَبِّ زِدْنِي عِلْماً"</h4>
            <p>"My Lord, increase me in knowledge"</p>
            <p style={{ fontSize: "14px", opacity: 0.8, marginTop: "10px" }}>
              May Allah increase us all in beneficial knowledge and
              righteousness
            </p>
          </div>

          {/* Game Statistics */}
          <div
            className="card"
            style={{ marginTop: "30px", textAlign: "left" }}
          >
            <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
              📊 إحصائيات الألعاب - Game Statistics
            </h4>
            <div className="stats-grid">
              <div className="stat-card info">
                <Target size={30} />
                <div className="stat-number">{state.gameStats.totalGames}</div>
                <div>إجمالي المباريات</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Total Games
                </div>
              </div>
              <div className="stat-card">
                <Trophy size={30} />
                <div className="stat-number">{state.gameStats.team1Wins}</div>
                <div>انتصارات الفريق 1</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Team 1 Wins
                </div>
              </div>
              <div className="stat-card secondary">
                <Trophy size={30} />
                <div className="stat-number">{state.gameStats.team2Wins}</div>
                <div>انتصارات الفريق 2</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Team 2 Wins
                </div>
              </div>
              <div className="stat-card success">
                <Users size={30} />
                <div className="stat-number">{state.gameStats.ties}</div>
                <div>التعادلات</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Ties</div>
              </div>
            </div>
          </div>

          {/* Game Summary */}
          <div
            className="card"
            style={{ marginTop: "30px", textAlign: "left" }}
          >
            <h4 style={{ textAlign: "center", marginBottom: "20px" }}>
              📋 ملخص اللعبة - Game Summary
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#2d5016",
                  }}
                >
                  {state.usedQuestions.length}
                </div>
                <div>أسئلة مجابة</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Questions Answered
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#2d5016",
                  }}
                >
                  {Object.keys(state.categories).length}
                </div>
                <div>تصنيفات مستخدمة</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Categories Used
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#2d5016",
                  }}
                >
                  {team1Score + team2Score}
                </div>
                <div>إجمالي النقاط</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  Total Points
                </div>
              </div>
              {state.usedTiebreakers.length > 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "15px",
                    background: "#fff3cd",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#856404",
                    }}
                  >
                    {state.usedTiebreakers.length}
                  </div>
                  <div>أسئلة فاصلة</div>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Tiebreaker Questions
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              marginTop: "40px",
              flexWrap: "wrap",
            }}
          >
            <button className="btn" onClick={handleNewGame}>
              <RefreshCw size={20} />
              مسابقة جديدة - New Game
            </button>
            <button className="btn btn-outline" onClick={handleBackToHome}>
              <Home size={20} />
              العودة للرئيسية - Back Home
            </button>
          </div>

          {/* Performance Message */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#e8f5e8",
              borderRadius: "15px",
            }}
          >
            <h5 style={{ color: "#2d5016", marginBottom: "10px" }}>
              🌟 أحسنتم!
            </h5>
            <p style={{ color: "#2d5016", margin: 0 }}>
              {winner
                ? `مبروك للفريق الفائز! وأحسن الله إليكم جميعاً على المشاركة والتعلم`
                : `أحسنتم جميعاً! التعادل يدل على مستوى متقارب في المعرفة الإسلامية`}
            </p>
            <p style={{ fontSize: "14px", color: "#4a7c59", marginTop: "5px" }}>
              {winner
                ? "Congratulations to the winning team! Well done to everyone for participating and learning."
                : "Well done everyone! A tie shows equal knowledge in Islamic studies."}
            </p>
          </div>
        </div>
      </div>

      {/* Celebration */}
      {state.celebration && (
        <div className="celebration">{state.celebration}</div>
      )}
    </div>
  );
};

export default ResultsScreen;
