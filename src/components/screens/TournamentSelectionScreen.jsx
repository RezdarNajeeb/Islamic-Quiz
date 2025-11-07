/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Trophy,
  ChevronRight,
  Users,
  List,
  Play,
  ArrowLeft,
} from "lucide-react";
import { useGame } from "../../context/GameContext";

const TournamentSelectionScreen = () => {
  const { state, dispatch } = useGame();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [teamNames, setTeamNames] = useState({ team1: "", team2: "" });

  const language = state.settings.language || "ckb";
  const tournaments = Object.values(state.tournaments || {});

  const handleBack = () => {
    if (showTeamInput) {
      setShowTeamInput(false);
    } else if (selectedGame) {
      setSelectedGame(null);
    } else if (selectedPhase) {
      setSelectedPhase(null);
    } else if (selectedTournament) {
      setSelectedTournament(null);
    } else {
      dispatch({ type: "SET_SCREEN", payload: "home" });
    }
  };

  const handleStartGame = () => {
    if (!teamNames.team1.trim() || !teamNames.team2.trim()) {
      alert(
        language === "ckb"
          ? "تکایە ناوی هەردوو تیم بنووسە / الرجاء إدخال اسم الفريقين"
          : "الرجاء إدخال اسم الفريقين / تکایە ناوی هەردوو تیم بنووسە"
      );
      return;
    }

    // Set team names
    dispatch({
      type: "SET_TEAMS",
      payload: {
        team1: { name: teamNames.team1, score: 0 },
        team2: { name: teamNames.team2, score: 0 },
      },
    });

    // Set current tournament and game
    dispatch({
      type: "SET_CURRENT_TOURNAMENT",
      payload: selectedTournament.id,
    });

    dispatch({
      type: "SET_CURRENT_TOURNAMENT_GAME",
      payload: {
        tournamentId: selectedTournament.id,
        phaseId: selectedPhase.id,
        gameId: selectedGame.id,
        questionIds: selectedGame.questionIds,
      },
    });

    // Update game status to in_progress
    dispatch({
      type: "UPDATE_TOURNAMENT_GAME",
      payload: {
        tournamentId: selectedTournament.id,
        phaseId: selectedPhase.id,
        gameId: selectedGame.id,
        gameData: {
          status: "in_progress",
          groupAName: teamNames.team1,
          groupBName: teamNames.team2,
        },
      },
    });

    // Navigate to game screen
    dispatch({ type: "SET_SCREEN", payload: "game" });
  };

  // Tournament selection view
  if (!selectedTournament) {
    return (
      <div className="fade-in">
        <div className="container" style={{ paddingTop: "40px" }}>
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "30px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Trophy size={32} style={{ color: "#2d5016" }} />
                <div>
                  <h2>
                    {language === "ckb"
                      ? "هەڵبژاردنی پاڵەوێنە"
                      : "اختيار البطولة"}
                  </h2>
                  <p style={{ margin: 0, color: "#666" }}>
                    {language === "ckb"
                      ? "پاڵەوێنەیەک هەڵبژێرە بۆ دەستپێکردنی یاری"
                      : "اختر بطولة لبدء اللعبة"}
                  </p>
                </div>
              </div>
              <button className="btn btn-outline" onClick={handleBack}>
                <ArrowLeft size={20} />
                {language === "ckb" ? "گەڕانەوە" : "رجوع"}
              </button>
            </div>

            {tournaments.length === 0 ? (
              <div className="text-center" style={{ padding: "60px 20px" }}>
                <Trophy size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
                <p style={{ color: "#666", fontSize: "18px" }}>
                  {language === "ckb"
                    ? "هیچ پاڵەوێنەیەک نییە"
                    : "لا توجد بطولات"}
                </p>
                <p style={{ color: "#999" }}>
                  {language === "ckb"
                    ? "بەڕێوەبەر دەتوانێت پاڵەوێنە دروست بکات لە پانێڵی بەڕێوەبردا"
                    : "يمكن للمسؤول إنشاء البطولات من لوحة الإدارة"}
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {tournaments.map((tournament) => {
                  const completedPhases = tournament.phases?.filter(
                    (p) => p.status === "completed"
                  ).length || 0;
                  const totalPhases = tournament.phases?.length || 0;

                  return (
                    <div
                      key={tournament.id}
                      className="card"
                      style={{
                        padding: "25px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => setSelectedTournament(tournament)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{ marginBottom: "10px" }}>
                            {language === "ckb"
                              ? tournament.nameCkb
                              : tournament.name}
                          </h3>
                          <p
                            style={{
                              color: "#666",
                              margin: "0 0 15px 0",
                              fontSize: "14px",
                            }}
                          >
                            {language === "ckb"
                              ? tournament.descriptionCkb
                              : tournament.description}
                          </p>
                          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                            <span
                              style={{
                                padding: "5px 15px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                background:
                                  tournament.status === "completed"
                                    ? "#d4edda"
                                    : tournament.status === "in_progress"
                                    ? "#fff3cd"
                                    : "#e7f3ff",
                                color:
                                  tournament.status === "completed"
                                    ? "#155724"
                                    : tournament.status === "in_progress"
                                    ? "#856404"
                                    : "#004085",
                              }}
                            >
                              {tournament.status === "completed"
                                ? language === "ckb"
                                  ? "تەواوبوو"
                                  : "مكتمل"
                                : tournament.status === "in_progress"
                                ? language === "ckb"
                                  ? "بەردەوامە"
                                  : "جاري"
                                : language === "ckb"
                                ? "چاوەڕوان"
                                : "معلق"}
                            </span>
                            <span style={{ fontSize: "14px", color: "#666" }}>
                              {completedPhases}/{totalPhases}{" "}
                              {language === "ckb" ? "قۆناغ" : "مراحل"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={28} style={{ color: "#2d5016" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phase selection view
  if (!selectedPhase) {
    return (
      <div className="fade-in">
        <div className="container" style={{ paddingTop: "40px" }}>
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "30px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Trophy size={32} style={{ color: "#2d5016" }} />
                <div>
                  <h2>
                    {language === "ckb"
                      ? selectedTournament.nameCkb
                      : selectedTournament.name}
                  </h2>
                  <p style={{ margin: 0, color: "#666" }}>
                    {language === "ckb"
                      ? "قۆناغێک هەڵبژێرە"
                      : "اختر مرحلة"}
                  </p>
                </div>
              </div>
              <button className="btn btn-outline" onClick={handleBack}>
                <ArrowLeft size={20} />
                {language === "ckb" ? "گەڕانەوە" : "رجوع"}
              </button>
            </div>

            {!selectedTournament.phases || selectedTournament.phases.length === 0 ? (
              <div className="text-center" style={{ padding: "60px 20px" }}>
                <List size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
                <p style={{ color: "#666", fontSize: "18px" }}>
                  {language === "ckb"
                    ? "هیچ قۆناغێک نییە"
                    : "لا توجد مراحل"}
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                {selectedTournament.phases
                  .sort((a, b) => a.order - b.order)
                  .map((phase) => {
                    const completedGames = phase.games?.filter(
                      (g) => g.status === "completed"
                    ).length || 0;
                    const totalGames = phase.games?.length || 0;

                    return (
                      <div
                        key={phase.id}
                        className="card"
                        style={{
                          padding: "25px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onClick={() => setSelectedPhase(phase)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h3 style={{ marginBottom: "10px" }}>
                              {language === "ckb" ? phase.nameCkb : phase.name}
                            </h3>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                              <span style={{ fontSize: "14px", color: "#666" }}>
                                {completedGames}/{totalGames}{" "}
                                {language === "ckb" ? "یاری تەواوبووە" : "ألعاب مكتملة"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={28} style={{ color: "#2d5016" }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Game selection view
  if (!showTeamInput) {
    return (
      <div className="fade-in">
        <div className="container" style={{ paddingTop: "40px" }}>
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "30px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Trophy size={32} style={{ color: "#2d5016" }} />
                <div>
                  <h2>
                    {language === "ckb" ? selectedPhase.nameCkb : selectedPhase.name}
                  </h2>
                  <p style={{ margin: 0, color: "#666" }}>
                    {language === "ckb" ? "یارییەک هەڵبژێرە" : "اختر لعبة"}
                  </p>
                </div>
              </div>
              <button className="btn btn-outline" onClick={handleBack}>
                <ArrowLeft size={20} />
                {language === "ckb" ? "گەڕانەوە" : "رجوع"}
              </button>
            </div>

            {!selectedPhase.games || selectedPhase.games.length === 0 ? (
              <div className="text-center" style={{ padding: "60px 20px" }}>
                <Play size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
                <p style={{ color: "#666", fontSize: "18px" }}>
                  {language === "ckb" ? "هیچ یارییەک نییە" : "لا توجد ألعاب"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                {selectedPhase.games.map((game, idx) => (
                  <div
                    key={game.id}
                    className="card"
                    style={{
                      padding: "20px",
                      cursor: game.status === "pending" ? "pointer" : "not-allowed",
                      opacity: game.status === "pending" ? 1 : 0.6,
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => {
                      if (game.status === "pending") {
                        setSelectedGame(game);
                        setShowTeamInput(true);
                      }
                    }}
                  >
                    <div style={{ marginBottom: "15px" }}>
                      <h4>
                        {language === "ckb" ? "یاری" : "لعبة"} {idx + 1}
                      </h4>
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Users size={16} />
                        {game.groupAName || game.groupAPlaceholder || (language === "ckb" ? "تیمی یەکەم" : "الفريق الأول")}
                        {" vs "}
                        {game.groupBName || game.groupBPlaceholder || (language === "ckb" ? "تیمی دووەم" : "الفريق الثاني")}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <List size={16} />
                        {game.questionIds?.length || 0}{" "}
                        {language === "ckb" ? "پرسیار" : "سؤال"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        display: "inline-block",
                        background:
                          game.status === "completed"
                            ? "#d4edda"
                            : game.status === "in_progress"
                            ? "#fff3cd"
                            : "#e7f3ff",
                        color:
                          game.status === "completed"
                            ? "#155724"
                            : game.status === "in_progress"
                            ? "#856404"
                            : "#004085",
                      }}
                    >
                      {game.status === "completed"
                        ? language === "ckb"
                          ? "تەواوبوو"
                          : "مكتمل"
                        : game.status === "in_progress"
                        ? language === "ckb"
                          ? "بەردەوامە"
                          : "جاري"
                        : language === "ckb"
                        ? "ئامادە"
                        : "جاهز"}
                    </div>
                    {game.status === "completed" && game.winner && (
                      <div style={{ marginTop: "10px", fontSize: "13px", color: "#2d5016", fontWeight: "600" }}>
                        {language === "ckb" ? "براوە: " : "الفائز: "}
                        {game.winner === "groupA" ? game.groupAName : game.groupBName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Team name input view
  return (
    <div className="fade-in">
      <div className="container" style={{ paddingTop: "40px" }}>
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "30px",
            }}
          >
            <Users size={32} style={{ color: "#2d5016" }} />
            <div>
              <h2>
                {language === "ckb"
                  ? "ناوی تیمەکان بنووسە"
                  : "أدخل أسماء الفرق"}
              </h2>
              <p style={{ margin: 0, color: "#666" }}>
                {language === "ckb"
                  ? "ناوی هەردوو تیم بۆ ئەم یارییە بنووسە"
                  : "أدخل أسماء الفريقين لهذه اللعبة"}
              </p>
            </div>
          </div>

          <div className="input-group">
            <label>
              {language === "ckb" ? "ناوی تیمی یەکەم" : "اسم الفريق الأول"}
            </label>
            <input
              type="text"
              value={teamNames.team1}
              onChange={(e) =>
                setTeamNames({ ...teamNames, team1: e.target.value })
              }
              placeholder={
                selectedGame?.groupAPlaceholder ||
                (language === "ckb" ? "تیمی یەکەم" : "الفريق الأول")
              }
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>
              {language === "ckb" ? "ناوی تیمی دووەم" : "اسم الفريق الثاني"}
            </label>
            <input
              type="text"
              value={teamNames.team2}
              onChange={(e) =>
                setTeamNames({ ...teamNames, team2: e.target.value })
              }
              placeholder={
                selectedGame?.groupBPlaceholder ||
                (language === "ckb" ? "تیمی دووەم" : "الفريق الثاني")
              }
            />
          </div>

          <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
            <button
              className="btn"
              onClick={handleStartGame}
              style={{ flex: 1 }}
            >
              <Play size={20} />
              {language === "ckb" ? "دەستپێکردنی یاری" : "بدء اللعبة"}
            </button>
            <button
              className="btn btn-outline"
              onClick={handleBack}
            >
              <ArrowLeft size={20} />
              {language === "ckb" ? "گەڕانەوە" : "رجوع"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentSelectionScreen;
