// App.jsx
import React from "react";
import { GameProvider } from "./context/GameContext";
import { useGame } from "./context/GameContext";
import HomeScreen from "./components/screens/HomeScreen";
import TeamSetupScreen from "./components/screens/TeamSetupScreen";
import GameScreen from "./components/screens/GameScreen";
import TiebreakerScreen from "./components/screens/TiebreakerScreen";
import ResultsScreen from "./components/screens/ResultsScreen";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import "./styles/styles.css";

const AppContent = () => {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case "teamSetup":
        return <TeamSetupScreen />;
      case "game":
        return <GameScreen />;
      case "tiebreaker":
        return <TiebreakerScreen />;
      case "results":
        return <ResultsScreen />;
      case "admin":
        return state.adminUser ? <AdminDashboard /> : <AdminLogin />;
      case "adminDashboard":
        return <AdminDashboard />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app-container">
      <div className="islamic-pattern"></div>
      {renderScreen()}
    </div>
  );
};

const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
