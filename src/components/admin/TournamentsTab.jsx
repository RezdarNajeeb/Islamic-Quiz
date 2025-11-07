/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Trophy,
  Plus,
  Edit,
  Trash2,
  Play,
  CheckCircle,
  AlertCircle,
  Users,
  List,
  Award,
  Target,
} from "lucide-react";
import { useGame } from "../../context/GameContext";

const TournamentsTab = () => {
  const { state, dispatch } = useGame();
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    nameCkb: "",
    description: "",
    descriptionCkb: "",
  });

  const [phaseForm, setPhaseForm] = useState({
    name: "",
    nameCkb: "",
    order: 1,
    gamesCount: 4,
  });

  const [gameForm, setGameForm] = useState({
    groupAPlaceholder: "",
    groupBPlaceholder: "",
    questionIds: [],
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleCreateTournament = () => {
    if (!tournamentForm.name.trim() || !tournamentForm.nameCkb.trim()) {
      showMessage("error", "یەکلایەنی ناو پڕبکەرەوە / Please fill tournament name");
      return;
    }

    dispatch({
      type: "CREATE_TOURNAMENT",
      payload: {
        ...tournamentForm,
        id: Date.now().toString(),
      },
    });

    setTournamentForm({
      name: "",
      nameCkb: "",
      description: "",
      descriptionCkb: "",
    });
    setShowTournamentModal(false);
    showMessage("success", "پاڵەوێنە بەسەرکەوتوویی دروستکرا / Tournament created successfully");
  };

  const handleAddPhase = () => {
    if (!selectedTournament || !phaseForm.name.trim()) {
      showMessage("error", "یەکلایەنی پڕبکەرەوە / Please fill phase name");
      return;
    }

    const phase = {
      id: Date.now().toString(),
      ...phaseForm,
      games: [],
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: "ADD_TOURNAMENT_PHASE",
      payload: {
        tournamentId: selectedTournament,
        phase,
      },
    });

    setPhaseForm({
      name: "",
      nameCkb: "",
      order: 1,
      gamesCount: 4,
    });
    setShowPhaseModal(false);
    showMessage("success", "قۆناغ زیادکرا / Phase added successfully");
  };

  const handleAddGame = () => {
    if (!selectedTournament || !selectedPhase) {
      showMessage("error", "پاڵەوێنە و قۆناغ هەڵبژێرە / Please select tournament and phase");
      return;
    }

    if (gameForm.questionIds.length === 0) {
      showMessage("error", "لانیکەم پرسیارێک هەڵبژێرە / Please select at least one question");
      return;
    }

    const game = {
      id: Date.now().toString(),
      ...gameForm,
      status: "pending",
      winner: null,
      groupAName: gameForm.groupAPlaceholder || "",
      groupBName: gameForm.groupBPlaceholder || "",
      groupAScore: 0,
      groupBScore: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: "ADD_TOURNAMENT_GAME",
      payload: {
        tournamentId: selectedTournament,
        phaseId: selectedPhase,
        game,
      },
    });

    setGameForm({
      groupAPlaceholder: "",
      groupBPlaceholder: "",
      questionIds: [],
    });
    setShowGameModal(false);
    showMessage("success", "یاری زیادکرا / Game added successfully");
  };

  const handleDeleteTournament = (tournamentId) => {
    if (
      window.confirm(
        "دڵنیایت لە سڕینەوەی ئەم پاڵەوێنەیە؟ / Are you sure you want to delete this tournament?"
      )
    ) {
      dispatch({
        type: "DELETE_TOURNAMENT",
        payload: tournamentId,
      });
      showMessage("success", "پاڵەوێنە سڕایەوە / Tournament deleted");
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setGameForm((prev) => ({
      ...prev,
      questionIds: prev.questionIds.includes(questionId)
        ? prev.questionIds.filter((id) => id !== questionId)
        : [...prev.questionIds, questionId],
    }));
  };

  const tournaments = Object.values(state.tournaments || {});
  const language = state.settings.language || "ckb";

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <Trophy size={28} style={{ color: "#2d5016" }} />
        <div>
          <h3>بەڕێوەبردنی پاڵەوێنەکان / Tournament Management</h3>
          <p style={{ color: "#666", margin: 0 }}>
            دروستکردن و بەڕێوەبردنی پاڵەوێنەکان / Create and manage tournaments
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      {/* Create Tournament Button */}
      <div style={{ marginBottom: "30px" }}>
        <button
          className="btn"
          onClick={() => setShowTournamentModal(true)}
        >
          <Plus size={20} />
          دروستکردنی پاڵەوێنەی نوێ / Create New Tournament
        </button>
      </div>

      {/* Tournaments List */}
      {tournaments.length === 0 ? (
        <div className="text-center" style={{ padding: "60px 20px" }}>
          <Trophy size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
          <p style={{ color: "#666", fontSize: "18px" }}>
            هیچ پاڵەوێنەیەک نییە / No tournaments yet
          </p>
          <p style={{ color: "#999" }}>
            کرتە لەسەر دوگمەی سەرەوە بکە بۆ دروستکردنی پاڵەوێنەی یەکەم
            <br />
            Click the button above to create your first tournament
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="card" style={{ padding: "25px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h4 style={{ marginBottom: "5px" }}>
                    {language === "ckb" ? tournament.nameCkb : tournament.name}
                  </h4>
                  <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
                    {language === "ckb"
                      ? tournament.descriptionCkb
                      : tournament.description}
                  </p>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
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
                        ? "تەواوبوو / Completed"
                        : tournament.status === "in_progress"
                        ? "بەردەوامە / In Progress"
                        : "چاوەڕوان / Pending"}
                    </span>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      {tournament.phases?.length || 0} قۆناغ / phases
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSelectedTournament(tournament.id);
                      setShowPhaseModal(true);
                    }}
                    style={{ padding: "8px 15px" }}
                  >
                    <Plus size={16} />
                    قۆناغ / Phase
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTournament(tournament.id)}
                    style={{ padding: "8px 15px" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Phases */}
              {tournament.phases && tournament.phases.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h5 style={{ marginBottom: "15px", color: "#2d5016" }}>
                    قۆناغەکان / Phases
                  </h5>
                  {tournament.phases
                    .sort((a, b) => a.order - b.order)
                    .map((phase) => (
                      <div
                        key={phase.id}
                        style={{
                          background: "#f8f9fa",
                          padding: "15px",
                          borderRadius: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <div>
                            <strong>
                              {language === "ckb" ? phase.nameCkb : phase.name}
                            </strong>
                            <span
                              style={{
                                marginLeft: "10px",
                                fontSize: "12px",
                                color: "#666",
                              }}
                            >
                              ({phase.games?.length || 0} یاری / games)
                            </span>
                          </div>
                          <button
                            className="btn"
                            onClick={() => {
                              setSelectedTournament(tournament.id);
                              setSelectedPhase(phase.id);
                              setShowGameModal(true);
                            }}
                            style={{ padding: "5px 15px", fontSize: "14px" }}
                          >
                            <Plus size={14} />
                            یاری / Game
                          </button>
                        </div>

                        {/* Games */}
                        {phase.games && phase.games.length > 0 && (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fill, minmax(300px, 1fr))",
                              gap: "10px",
                              marginTop: "10px",
                            }}
                          >
                            {phase.games.map((game, idx) => (
                              <div
                                key={game.id}
                                style={{
                                  background: "white",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #dee2e6",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    marginBottom: "8px",
                                  }}
                                >
                                  یاری {idx + 1} / Game {idx + 1}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666" }}>
                                  <div style={{ marginBottom: "4px" }}>
                                    <Users size={12} style={{ marginRight: "5px" }} />
                                    {game.groupAName ||
                                      game.groupAPlaceholder ||
                                      "تیمی یەکەم"}
                                    {" vs "}
                                    {game.groupBName ||
                                      game.groupBPlaceholder ||
                                      "تیمی دووەم"}
                                  </div>
                                  <div>
                                    <List size={12} style={{ marginRight: "5px" }} />
                                    {game.questionIds?.length || 0} پرسیار / questions
                                  </div>
                                </div>
                                <div
                                  style={{
                                    marginTop: "8px",
                                    padding: "4px 8px",
                                    borderRadius: "5px",
                                    fontSize: "11px",
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
                                    ? "تەواوبوو"
                                    : game.status === "in_progress"
                                    ? "بەردەوامە"
                                    : "چاوەڕوان"}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Tournament Modal */}
      {showTournamentModal && (
        <div className="modal-overlay" onClick={() => setShowTournamentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "20px" }}>
              دروستکردنی پاڵەوێنەی نوێ / Create New Tournament
            </h3>

            <div className="input-group">
              <label>ناوی پاڵەوێنە (عەرەبی) / Tournament Name (Arabic)</label>
              <input
                type="text"
                value={tournamentForm.name}
                onChange={(e) =>
                  setTournamentForm({ ...tournamentForm, name: e.target.value })
                }
                placeholder="مسابقة المعرفة الإسلامية 2024"
              />
            </div>

            <div className="input-group">
              <label>ناوی پاڵەوێنە (کوردی) / Tournament Name (Kurdish)</label>
              <input
                type="text"
                value={tournamentForm.nameCkb}
                onChange={(e) =>
                  setTournamentForm({ ...tournamentForm, nameCkb: e.target.value })
                }
                placeholder="پاڵەوێنەی زانستی ئیسلامی ٢٠٢٤"
              />
            </div>

            <div className="input-group">
              <label>وەسف (عەرەبی) / Description (Arabic)</label>
              <textarea
                value={tournamentForm.description}
                onChange={(e) =>
                  setTournamentForm({
                    ...tournamentForm,
                    description: e.target.value,
                  })
                }
                rows="3"
                placeholder="وصف المسابقة"
              />
            </div>

            <div className="input-group">
              <label>وەسف (کوردی) / Description (Kurdish)</label>
              <textarea
                value={tournamentForm.descriptionCkb}
                onChange={(e) =>
                  setTournamentForm({
                    ...tournamentForm,
                    descriptionCkb: e.target.value,
                  })
                }
                rows="3"
                placeholder="وەسفی پاڵەوێنە"
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn" onClick={handleCreateTournament}>
                <CheckCircle size={20} />
                دروستکردن / Create
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowTournamentModal(false)}
              >
                پاشگەزبوونەوە / Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Phase Modal */}
      {showPhaseModal && (
        <div className="modal-overlay" onClick={() => setShowPhaseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "20px" }}>
              زیادکردنی قۆناغ / Add Phase
            </h3>

            <div className="input-group">
              <label>ناوی قۆناغ (عەرەبی) / Phase Name (Arabic)</label>
              <input
                type="text"
                value={phaseForm.name}
                onChange={(e) =>
                  setPhaseForm({ ...phaseForm, name: e.target.value })
                }
                placeholder="المرحلة الأولى"
              />
            </div>

            <div className="input-group">
              <label>ناوی قۆناغ (کوردی) / Phase Name (Kurdish)</label>
              <input
                type="text"
                value={phaseForm.nameCkb}
                onChange={(e) =>
                  setPhaseForm({ ...phaseForm, nameCkb: e.target.value })
                }
                placeholder="قۆناغی یەکەم"
              />
            </div>

            <div className="input-group">
              <label>ڕیزبەندی / Order</label>
              <input
                type="number"
                value={phaseForm.order}
                onChange={(e) =>
                  setPhaseForm({
                    ...phaseForm,
                    order: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
              />
            </div>

            <div className="input-group">
              <label>ژمارەی یاریەکان / Games Count</label>
              <input
                type="number"
                value={phaseForm.gamesCount}
                onChange={(e) =>
                  setPhaseForm({
                    ...phaseForm,
                    gamesCount: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
              />
              <small>
                پێشنیارکراو: قۆناغی 1: 4 یاری، قۆناغی 2: 2 یاری، قۆناغی 3: 1 یاری
                <br />
                Suggested: Phase 1: 4 games, Phase 2: 2 games, Phase 3: 1 game
              </small>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn" onClick={handleAddPhase}>
                <CheckCircle size={20} />
                زیادکردن / Add
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowPhaseModal(false)}
              >
                پاشگەزبوونەوە / Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Game Modal */}
      {showGameModal && (
        <div className="modal-overlay" onClick={() => setShowGameModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <h3 style={{ marginBottom: "20px" }}>
              زیادکردنی یاری / Add Game
            </h3>

            <div className="input-group">
              <label>ناوی تیمی یەکەم (دڵخواز) / Team A Placeholder (Optional)</label>
              <input
                type="text"
                value={gameForm.groupAPlaceholder}
                onChange={(e) =>
                  setGameForm({ ...gameForm, groupAPlaceholder: e.target.value })
                }
                placeholder="تیمی یەکەم / Team A"
              />
            </div>

            <div className="input-group">
              <label>ناوی تیمی دووەم (دڵخواز) / Team B Placeholder (Optional)</label>
              <input
                type="text"
                value={gameForm.groupBPlaceholder}
                onChange={(e) =>
                  setGameForm({ ...gameForm, groupBPlaceholder: e.target.value })
                }
                placeholder="تیمی دووەم / Team B"
              />
            </div>

            <div className="input-group">
              <label>
                هەڵبژاردنی پرسیارەکان / Select Questions ({gameForm.questionIds.length} selected)
              </label>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "2px solid #dee2e6",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                {Object.values(state.questions).map((question) => {
                  const isSelected = gameForm.questionIds.includes(question.id);
                  return (
                    <div
                      key={question.id}
                      onClick={() => toggleQuestionSelection(question.id)}
                      style={{
                        padding: "10px",
                        marginBottom: "8px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: isSelected ? "#e8f5e8" : "#f8f9fa",
                        border: `2px solid ${isSelected ? "#2d5016" : "transparent"}`,
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ marginTop: "2px" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", marginBottom: "5px" }}>
                            {language === "ckb"
                              ? question.questionCkb
                              : question.question}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {state.categories[question.category]?.[
                              language === "ckb" ? "nameCkb" : "name"
                            ] || question.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn" onClick={handleAddGame}>
                <CheckCircle size={20} />
                زیادکردن / Add
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowGameModal(false)}
              >
                پاشگەزبوونەوە / Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentsTab;
