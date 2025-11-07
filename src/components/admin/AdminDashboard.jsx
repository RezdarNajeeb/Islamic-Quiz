// components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  Shield,
  LogOut,
  Target,
  BookOpen,
  Brain,
  Settings,
  Zap,
  User,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import DashboardTab from "./DashboardTab";
import CategoriesTab from "./CategoriesTab";
import QuestionsTab from "./QuestionsTab";
import TiebreakersTab from "./TiebreakersTab";
import SettingsTab from "./SettingsTab";

const AdminDashboard = () => {
  const { state, dispatch } = useGame();
  const [currentTab, setCurrentTab] = useState("dashboard");

  const handleLogout = () => {
    if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      dispatch({ type: "SET_ADMIN_USER", payload: null });
      dispatch({ type: "SET_SCREEN", payload: "home" });
    }
  };

  const tabs = [
    { id: "dashboard", name: "لوحة التحكم", nameEn: "Dashboard", icon: Target },
    {
      id: "categories",
      name: "التصنيفات",
      nameEn: "Categories",
      icon: BookOpen,
    },
    { id: "questions", name: "الأسئلة", nameEn: "Questions", icon: Brain },
    {
      id: "tiebreakers",
      name: "أسئلة فاصلة",
      nameEn: "Tiebreakers",
      icon: Zap,
    },
    { id: "settings", name: "الإعدادات", nameEn: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardTab />;
      case "categories":
        return <CategoriesTab />;
      case "questions":
        return <QuestionsTab />;
      case "tiebreakers":
        return <TiebreakersTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div>
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-nav">
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <Shield size={24} />
              <div>
                <h2>لوحة إدارة المسابقات الإسلامية</h2>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
                  Islamic Quiz Platform Admin Dashboard
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {/* Admin info */}
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <User size={16} />
                  <span>{state.adminUser?.name || "Admin"}</span>
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  {state.adminUser?.email}
                </div>
              </div>

              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOut size={20} />
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px 1fr",
            gap: "30px",
          }}
        >
          {/* Sidebar */}
          <div>
            <div className="admin-sidebar">
              <h4 style={{ marginBottom: "20px", color: "#2d5016" }}>
                القائمة الرئيسية
              </h4>
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <div
                    key={tab.id}
                    className={`sidebar-item ${
                      currentTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setCurrentTab(tab.id)}
                  >
                    <IconComponent size={20} />
                    <div>
                      <div>{tab.name}</div>
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        {tab.nameEn}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Card */}
            <div
              className="card"
              style={{ marginTop: "20px", padding: "15px" }}
            >
              <h5 style={{ marginBottom: "15px", color: "#2d5016" }}>
                إحصائيات سريعة
              </h5>
              <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>التصنيفات:</span>
                  <strong>{Object.keys(state.categories).length}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>الأسئلة:</span>
                  <strong>{Object.keys(state.questions).length}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>أسئلة فاصلة:</span>
                  <strong>{Object.keys(state.tiebreakers).length}</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>إجمالي المباريات:</span>
                  <strong>{state.gameStats.totalGames}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
