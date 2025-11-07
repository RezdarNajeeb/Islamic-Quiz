// components/screens/HomeScreen.jsx
import React from "react";
import { BookOpen, Play, Shield, Trophy } from "lucide-react";
import { useGame } from "../../context/GameContext";

const HomeScreen = () => {
  const { state, dispatch } = useGame();
  const language = state.settings.language || "ckb";

  return (
    <div className="fade-in">
      <div className="container">
        <div className="header">
          <BookOpen size={80} style={{ marginBottom: "20px" }} />
          <h1>
            {language === "ckb"
              ? "سەکۆی پاڵەوێنەکانی ئیسلامی"
              : "منصة المسابقات الإسلامية"}
          </h1>
          <h2>
            {language === "ckb"
              ? "منصة المسابقات الإسلامية"
              : "سەکۆی پاڵەوێنەکانی ئیسلامی"}
          </h2>
          <p className="text-arabic">
            "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
            <br />
            {language === "ckb"
              ? '"باشترینتان ئەوەیە کە قورئان فێربێت و فێری بکات"'
              : "خيركم من تعلم القرآن وعلمه"}
          </p>
        </div>

        <div className="grid grid-3">
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
            <h3>{language === "ckb" ? "یاری ئاسایی" : "مباراة عادية"}</h3>
            <p>{language === "ckb" ? "مباراة عادية" : "یاری ئاسایی"}</p>
          </div>

          <div
            className="card text-center"
            onClick={() =>
              dispatch({ type: "SET_SCREEN", payload: "tournamentSelection" })
            }
            style={{ cursor: "pointer" }}
          >
            <Trophy
              size={48}
              style={{ color: "#b8860b", marginBottom: "20px" }}
            />
            <h3>{language === "ckb" ? "پاڵەوێنە" : "بطولة"}</h3>
            <p>{language === "ckb" ? "بطولة" : "پاڵەوێنە"}</p>
          </div>

          <div
            className="card text-center"
            onClick={() => dispatch({ type: "SET_SCREEN", payload: "admin" })}
            style={{ cursor: "pointer" }}
          >
            <Shield
              size={48}
              style={{ color: "#2d5016", marginBottom: "20px" }}
            />
            <h3>{language === "ckb" ? "بەڕێوەبردن" : "الإدارة"}</h3>
            <p>{language === "ckb" ? "الإدارة" : "بەڕێوەبردن"}</p>
          </div>
        </div>

        <div className="islamic-card">
          <h3>{language === "ckb" ? "بە ناوی خوا دەستپێدەکەین" : "بسم الله نبدأ"}</h3>
          <p>
            {language === "ckb"
              ? "خوا بەرەکەتی گەشتی فێربوونمان بدات و زانیارییەکانمان زیاد بکات"
              : "بارك الله في رحلتنا التعليمية وزادنا من العلم النافع"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
