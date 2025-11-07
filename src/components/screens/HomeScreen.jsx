// components/screens/HomeScreen.jsx
import React from "react";
import { BookOpen, Play, Shield } from "lucide-react";
import { useGame } from "../../context/GameContext";

const HomeScreen = () => {
  const { dispatch } = useGame();

  return (
    <div className="fade-in">
      <div className="container">
        <div className="header">
          <BookOpen size={80} style={{ marginBottom: "20px" }} />
          <h1>منصة المسابقات الإسلامية</h1>
          <h2>Islamic Knowledge Competition Platform</h2>
          <p className="text-arabic">
            "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
            <br />
            "The best among you are those who learn the Qur'an and teach it."
          </p>
        </div>

        <div className="grid grid-2">
          <div
            className="card text-center"
            onClick={() =>
              dispatch({ type: "SET_SCREEN", payload: "teamSetup" })
            }
            style={{ cursor: "pointer" }}
          >
            <Play
              size={48}
              style={{ color: "#2d5016", marginBottom: "20px" }}
            />
            <h3>ابدأ المسابقة</h3>
            <p>Start New Competition</p>
          </div>

          <div
            className="card text-center"
            onClick={() => dispatch({ type: "SET_SCREEN", payload: "admin" })}
            style={{ cursor: "pointer" }}
          >
            <Shield
              size={48}
              style={{ color: "#b8860b", marginBottom: "20px" }}
            />
            <h3>لوحة الإدارة</h3>
            <p>Admin Dashboard</p>
          </div>
        </div>

        <div className="islamic-card">
          <h3>بسم الله نبدأ</h3>
          <p>
            May Allah bless our learning journey and increase us in beneficial
            knowledge
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
