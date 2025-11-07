/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Shield, AlertCircle, Home, Eye, EyeOff } from "lucide-react";
import { useGame } from "../../context/GameContext";

const AdminLogin = () => {
  const { dispatch } = useGame();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - replace with real authentication
      if (
        formData.email === "admin@mosque.com" &&
        formData.password === "admin123"
      ) {
        const mockUser = {
          uid: "admin",
          email: formData.email,
          name: "مدير النظام",
          role: "admin",
          loginTime: new Date().toISOString(),
        };

        dispatch({ type: "SET_ADMIN_USER", payload: mockUser });
        dispatch({ type: "SET_SCREEN", payload: "adminDashboard" });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError("بيانات دخول غير صحيحة - Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="container" style={{ paddingTop: "100px" }}>
        <div className="card" style={{ maxWidth: "450px", margin: "0 auto" }}>
          <div className="text-center">
            <Shield
              size={48}
              style={{ color: "#2d5016", marginBottom: "20px" }}
            />
            <h2>دخول الإدارة</h2>
            <h3 style={{ color: "#666", marginBottom: "30px" }}>Admin Login</h3>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>البريد الإلكتروني - Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="admin@mosque.com"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>كلمة المرور - Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  style={{ paddingRight: "45px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#666",
                  }}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn"
              disabled={loading || !formData.email || !formData.password}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              {loading ? <div className="loading"></div> : "دخول - Login"}
            </button>
          </form>

          <div className="text-center">
            <button
              className="btn btn-outline"
              onClick={() => dispatch({ type: "SET_SCREEN", payload: "home" })}
              disabled={loading}
            >
              <Home size={20} />
              العودة للرئيسية - Back Home
            </button>
          </div>

          {/* Demo credentials info */}
          <div className="alert alert-info" style={{ marginTop: "20px" }}>
            <div>
              <strong>🔐 بيانات تجريبية - Demo Credentials:</strong>
              <br />
              <strong>Email:</strong> admin@mosque.com
              <br />
              <strong>Password:</strong> admin123
            </div>
          </div>

          {/* Security note */}
          <div
            style={{
              marginTop: "20px",
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
            }}
          >
            <p>
              🔒 هذا نظام تجريبي. في الإنتاج، استخدم نظام مصادقة آمن
              <br />
              This is a demo system. In production, use secure authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
