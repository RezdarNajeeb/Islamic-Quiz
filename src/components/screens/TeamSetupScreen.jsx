// components/screens/TeamSetupScreen.jsx
import React, { useState } from "react";
import { Users, Play, Home } from "lucide-react";
import { useGame } from "../../context/GameContext";

const TeamSetupScreen = () => {
  const { dispatch } = useGame();
  const [team1Name, setTeam1Name] = useState("فريق الأنصار");
  const [team2Name, setTeam2Name] = useState("فريق المهاجرين");

  const handleStart = () => {
    dispatch({
      type: "SET_TEAMS",
      payload: {
        team1: { name: team1Name, score: 0 },
        team2: { name: team2Name, score: 0 },
      },
    });
    dispatch({ type: "SET_SCREEN", payload: "game" });
  };

  return (
    <div className="slide-in">
      <div className="container" style={{ paddingTop: "60px" }}>
        <div className="card">
          <div className="text-center">
            <Users
              size={48}
              style={{ color: "#2d5016", marginBottom: "20px" }}
            />
            <h2>إعداد الفرق</h2>
            <p style={{ marginBottom: "40px" }}>Team Setup</p>
          </div>

          <div className="grid grid-2">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)",
                color: "white",
              }}
            >
              <h3>الفريق الأول</h3>
              <div className="input-group">
                <label style={{ color: "white" }}>اسم الفريق</label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  style={{ background: "white", color: "#2d5016" }}
                  placeholder="أدخل اسم الفريق الأول"
                />
              </div>
            </div>

            <div
              className="card"
              style={{
                background: "linear-gradient(135deg, #b8860b 0%, #daa520 100%)",
                color: "white",
              }}
            >
              <h3>الفريق الثاني</h3>
              <div className="input-group">
                <label style={{ color: "white" }}>اسم الفريق</label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  style={{ background: "white", color: "#b8860b" }}
                  placeholder="أدخل اسم الفريق الثاني"
                />
              </div>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: "40px" }}>
            <button
              className="btn"
              onClick={handleStart}
              disabled={!team1Name.trim() || !team2Name.trim()}
              style={{
                marginRight: "20px",
                fontSize: "1.2rem",
                padding: "15px 40px",
              }}
            >
              <Play size={20} />
              ابدأ المسابقة
            </button>

            <button
              className="btn btn-outline"
              onClick={() => dispatch({ type: "SET_SCREEN", payload: "home" })}
            >
              <Home size={20} />
              العودة للرئيسية
            </button>
          </div>

          <div className="alert alert-info" style={{ marginTop: "30px" }}>
            <p>
              <strong>تعليمات:</strong> تأكد من إدخال أسماء واضحة للفرق. يمكن
              تغيير الأسماء في أي وقت من إعدادات اللعبة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSetupScreen;
