// components/admin/DashboardTab.jsx
import React from "react";
import {
  BookOpen,
  Brain,
  CheckCircle,
  Zap,
  Trophy,
  Users,
  Target,
  TrendingUp,
} from "lucide-react";
import { useGame } from "../../context/GameContext";

const DashboardTab = () => {
  const { state } = useGame();

  const getQuestionsPerCategory = () => {
    const categoryStats = {};
    Object.entries(state.categories).forEach(([id, category]) => {
      const categoryQuestions = Object.values(state.questions).filter(
        (q) => q.category === id
      );
      categoryStats[id] = {
        name: category.name,
        nameEn: category.nameEn,
        total: categoryQuestions.length,
        used: state.usedQuestions.filter(
          (qId) => state.questions[qId]?.category === id
        ).length,
      };
    });
    return categoryStats;
  };

  const categoryStats = getQuestionsPerCategory();
  const totalQuestions = Object.keys(state.questions).length;
  const totalTiebreakers = Object.keys(state.tiebreakers).length;
  const totalCategories = Object.keys(state.categories).length;
  const usedQuestions = state.usedQuestions.length;
  const usagePercentage =
    totalQuestions > 0 ? Math.round((usedQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h3>لوحة التحكم الرئيسية</h3>
          <p style={{ color: "#666", margin: 0 }}>Main Dashboard Overview</p>
        </div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          آخر تحديث: {new Date().toLocaleString("ar-SA")}
        </div>
      </div>

      {/* Main Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <BookOpen size={40} style={{ marginBottom: "15px" }} />
          <div className="stat-number">{totalCategories}</div>
          <div>التصنيفات</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>Categories</div>
        </div>

        <div className="stat-card secondary">
          <Brain size={40} style={{ marginBottom: "15px" }} />
          <div className="stat-number">{totalQuestions}</div>
          <div>الأسئلة</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>Questions</div>
        </div>

        <div className="stat-card success">
          <CheckCircle size={40} style={{ marginBottom: "15px" }} />
          <div className="stat-number">{usedQuestions}</div>
          <div>مستخدمة</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Used ({usagePercentage}%)
          </div>
        </div>

        <div className="stat-card info">
          <Zap size={40} style={{ marginBottom: "15px" }} />
          <div className="stat-number">{totalTiebreakers}</div>
          <div>أسئلة فاصلة</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>Tiebreakers</div>
        </div>
      </div>

      {/* System Status */}
      <div className="alert alert-success" style={{ marginTop: "30px" }}>
        <CheckCircle size={20} />
        <div>
          <strong>✅ النظام يعمل بشكل طبيعي</strong>
          <br />
          System is running normally - All components are operational
        </div>
      </div>

      {/* Game Statistics */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h4
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Trophy size={24} />
          إحصائيات المباريات - Game Statistics
        </h4>
        <div className="stats-grid">
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "10px",
            }}
          >
            <Target
              size={30}
              style={{ color: "#2d5016", marginBottom: "10px" }}
            />
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#2d5016" }}
            >
              {state.gameStats.totalGames}
            </div>
            <div>إجمالي المباريات</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>Total Games</div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#e8f5e8",
              borderRadius: "10px",
            }}
          >
            <Users
              size={30}
              style={{ color: "#28a745", marginBottom: "10px" }}
            />
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745" }}
            >
              {state.gameStats.team1Wins}
            </div>
            <div>انتصارات الفريق 1</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>Team 1 Wins</div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#fff3cd",
              borderRadius: "10px",
            }}
          >
            <Users
              size={30}
              style={{ color: "#856404", marginBottom: "10px" }}
            />
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#856404" }}
            >
              {state.gameStats.team2Wins}
            </div>
            <div>انتصارات الفريق 2</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>Team 2 Wins</div>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "#e7f3ff",
              borderRadius: "10px",
            }}
          >
            <TrendingUp
              size={30}
              style={{ color: "#0066cc", marginBottom: "10px" }}
            />
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#0066cc" }}
            >
              {state.gameStats.ties}
            </div>
            <div>التعادلات</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>Ties</div>
          </div>
        </div>
      </div>

      {/* Category Usage Statistics */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h4 style={{ marginBottom: "20px" }}>
          📊 استخدام التصنيفات - Category Usage
        </h4>
        {Object.entries(categoryStats).map(([id, stats]) => {
          const percentage =
            stats.total > 0 ? Math.round((stats.used / stats.total) * 100) : 0;
          return (
            <div key={id} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div>
                  <span style={{ fontWeight: "bold" }}>{stats.name}</span>
                  <span
                    style={{
                      fontSize: "14px",
                      opacity: 0.7,
                      marginLeft: "10px",
                    }}
                  >
                    {stats.nameEn}
                  </span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {stats.used}/{stats.total} ({percentage}%)
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`,
                    background:
                      percentage > 75
                        ? "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)"
                        : percentage > 50
                        ? "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)"
                        : "linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h4 style={{ marginBottom: "20px" }}>
          ⚡ إجراءات سريعة - Quick Actions
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <button className="btn" style={{ padding: "15px", fontSize: "14px" }}>
            <BookOpen size={16} />
            إضافة تصنيف جديد
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: "15px", fontSize: "14px" }}
          >
            <Brain size={16} />
            إضافة سؤال جديد
          </button>
          <button
            className="btn"
            style={{ padding: "15px", fontSize: "14px", background: "#dc3545" }}
          >
            <Zap size={16} />
            إضافة سؤال فاصل
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: "15px", fontSize: "14px" }}
          >
            <Trophy size={16} />
            عرض الإحصائيات
          </button>
        </div>
      </div>

      {/* Storage Info */}
      <div className="alert alert-info" style={{ marginTop: "30px" }}>
        <div>
          <strong>💾 معلومات التخزين - Storage Information:</strong>
          <br />
          جميع البيانات محفوظة محلياً في المتصفح (localStorage). لنسخ احتياطي،
          استخدم خاصية تصدير البيانات من الإعدادات.
          <br />
          <em>
            All data is stored locally in browser (localStorage). For backup,
            use the export data feature in settings.
          </em>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
