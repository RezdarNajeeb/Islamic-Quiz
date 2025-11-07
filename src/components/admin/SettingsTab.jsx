
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  Database,
  Timer,
  Globe,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import {
  exportData,
  importData,
  clearLocalStorage,
} from "../../utils/localStorage";

const SettingsTab = () => {
  const { state, dispatch } = useGame();
  const [settings, setSettings] = useState(state.settings);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [importing, setImporting] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSave = () => {
    try {
      dispatch({ type: "UPDATE_SETTINGS", payload: settings });
      showMessage(
        "success",
        "تم حفظ الإعدادات بنجاح - Settings saved successfully"
      );
    } catch (error) {
      showMessage("error", "حدث خطأ أثناء الحفظ - Error occurred while saving");
    }
  };

  const handleExportData = () => {
    try {
      exportData();
      showMessage(
        "success",
        "تم تصدير البيانات بنجاح - Data exported successfully"
      );
    } catch (error) {
      showMessage(
        "error",
        "حدث خطأ أثناء التصدير - Error occurred during export"
      );
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await importData(file);

      // Update state with imported data
      if (data.categories) {
        dispatch({ type: "SET_CATEGORIES", payload: data.categories });
      }
      if (data.questions) {
        dispatch({ type: "SET_QUESTIONS", payload: data.questions });
      }
      if (data.tiebreakers) {
        dispatch({ type: "SET_TIEBREAKERS", payload: data.tiebreakers });
      }
      if (data.gameStats) {
        dispatch({ type: "UPDATE_GAME_STATS", payload: data.gameStats });
      }
      if (data.settings) {
        dispatch({ type: "UPDATE_SETTINGS", payload: data.settings });
        setSettings(data.settings);
      }

      showMessage(
        "success",
        "تم استيراد البيانات بنجاح - Data imported successfully"
      );
    } catch (error) {
      showMessage(
        "error",
        "حدث خطأ أثناء الاستيراد - Error occurred during import: " +
          error.message
      );
    }
    setImporting(false);

    // Clear file input
    event.target.value = "";
  };

  const handleResetStats = () => {
    if (
      window.confirm(
        "هل أنت متأكد من إعادة تعيين جميع الإحصائيات؟\nسيتم فقدان جميع بيانات المباريات السابقة.\n\nAre you sure you want to reset all statistics?\nAll previous game data will be lost."
      )
    ) {
      dispatch({
        type: "UPDATE_GAME_STATS",
        payload: { totalGames: 0, team1Wins: 0, team2Wins: 0, ties: 0 },
      });
      showMessage(
        "success",
        "تم إعادة تعيين الإحصائيات بنجاح - Statistics reset successfully"
      );
    }
  };

  const handleResetAllData = () => {
    if (
      window.confirm(
        "⚠️ تحذير: هذا الإجراء سيحذف جميع البيانات!\n\nسيتم حذف:\n- جميع التصنيفات\n- جميع الأسئلة\n- جميع الأسئلة الفاصلة\n- جميع الإحصائيات\n- جميع الإعدادات\n\nهل أنت متأكد تماماً؟\n\n⚠️ WARNING: This action will delete ALL data!\n\nThis will delete:\n- All categories\n- All questions\n- All tiebreakers\n- All statistics\n- All settings\n\nAre you absolutely sure?"
      )
    ) {
      try {
        clearLocalStorage();
        // Reload the page to reset everything
        window.location.reload();
      } catch (error) {
        showMessage(
          "error",
          "حدث خطأ أثناء إعادة التعيين - Error occurred during reset"
        );
      }
    }
  };

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
        <Settings size={28} style={{ color: "#2d5016" }} />
        <div>
          <h3>إعدادات النظام</h3>
          <p style={{ color: "#666", margin: 0 }}>System Settings</p>
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

      {/* Timer Settings */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h4
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Timer size={24} />
          إعدادات الوقت - Timer Settings
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="input-group">
            <label>مدة السؤال العادي (ثانية)</label>
            <input
              type="number"
              value={settings.normalTimer}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  normalTimer: parseInt(e.target.value) || 120,
                })
              }
              min="30"
              max="300"
              step="10"
            />
            <small style={{ color: "#666" }}>
              الوقت المخصص للإجابة على الأسئلة العادية (30-300 ثانية)
            </small>
          </div>

          <div className="input-group">
            <label>مدة سؤال الجولة الفاصلة (ثانية)</label>
            <input
              type="number"
              value={settings.tiebreakerTimer}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  tiebreakerTimer: parseInt(e.target.value) || 60,
                })
              }
              min="15"
              max="180"
              step="5"
            />
            <small style={{ color: "#666" }}>
              الوقت المخصص للأسئلة الفاصلة (15-180 ثانية)
            </small>
          </div>
        </div>
      </div>

      {/* Language & Display Settings */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h4
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Globe size={24} />
          إعدادات اللغة والعرض - Language & Display Settings
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="input-group">
            <label>اللغة الرئيسية</label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option value="ar">العربية - Arabic</option>
              <option value="en">English - الإنجليزية</option>
              <option value="both">Both / كلاهما</option>
            </select>
            <small style={{ color: "#666" }}>
              اللغة المعروضة في واجهة المسابقة
            </small>
          </div>

          <div className="input-group">
            <label
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, soundEnabled: e.target.checked })
                }
                style={{ width: "auto" }}
              />
              تفعيل الأصوات
            </label>
            <small style={{ color: "#666" }}>
              تشغيل الأصوات للتنبيهات والإشعارات
            </small>
          </div>
        </div>
      </div>

      {/* Save Settings Button */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          className="btn"
          onClick={handleSave}
          style={{ fontSize: "1.1rem", padding: "15px 40px" }}
        >
          <Save size={20} />
          حفظ الإعدادات - Save Settings
        </button>
      </div>

      {/* Data Management */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h4
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Database size={24} />
          إدارة البيانات - Data Management
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <button className="btn btn-secondary" onClick={handleExportData}>
            <Download size={20} />
            تصدير البيانات
          </button>

          <label
            className="btn btn-outline"
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Upload size={20} />
            {importing ? "جاري الاستيراد..." : "استيراد البيانات"}
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: "none" }}
              disabled={importing}
            />
          </label>

          <button
            className="btn"
            onClick={handleResetStats}
            style={{ background: "#ffc107", borderColor: "#ffc107" }}
          >
            <RefreshCw size={20} />
            إعادة تعيين الإحصائيات
          </button>

          <button className="btn btn-danger" onClick={handleResetAllData}>
            <AlertCircle size={20} />
            حذف جميع البيانات
          </button>
        </div>

        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          <p>
            <strong>تصدير البيانات:</strong> حفظ نسخة احتياطية من جميع البيانات
            بصيغة JSON
          </p>
          <p>
            <strong>استيراد البيانات:</strong> استعادة البيانات من ملف JSON
            محفوظ مسبقاً
          </p>
          <p>
            <strong>إعادة تعيين الإحصائيات:</strong> حذف إحصائيات المباريات مع
            الاحتفاظ بالأسئلة والتصنيفات
          </p>
          <p>
            <strong>حذف جميع البيانات:</strong> حذف كامل لجميع البيانات والعودة
            للحالة الأولية
          </p>
        </div>
      </div>

      {/* System Information */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h4 style={{ marginBottom: "20px" }}>
          📊 معلومات النظام - System Information
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div
            style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
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
            <div style={{ fontSize: "14px" }}>التصنيفات المحفوظة</div>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#2d5016",
              }}
            >
              {Object.keys(state.questions).length}
            </div>
            <div style={{ fontSize: "14px" }}>الأسئلة المحفوظة</div>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#2d5016",
              }}
            >
              {Object.keys(state.tiebreakers).length}
            </div>
            <div style={{ fontSize: "14px" }}>الأسئلة الفاصلة</div>
          </div>

          <div
            style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#2d5016",
              }}
            >
              {state.gameStats.totalGames}
            </div>
            <div style={{ fontSize: "14px" }}>إجمالي المباريات</div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#e8f5e8",
            borderRadius: "8px",
          }}
        >
          <h6 style={{ color: "#2d5016", marginBottom: "10px" }}>
            🔧 المعلومات التقنية
          </h6>
          <div
            style={{ fontSize: "14px", color: "#4a7c59", lineHeight: "1.6" }}
          >
            <p>
              <strong>نوع التخزين:</strong> localStorage (متصفح محلي)
            </p>
            <p>
              <strong>حجم البيانات المقدر:</strong> ~
              {Math.round(JSON.stringify(state).length / 1024)} KB
            </p>
            <p>
              <strong>آخر حفظ:</strong> {new Date().toLocaleString("ar-SA")}
            </p>
            <p>
              <strong>الإصدار:</strong> 1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="alert alert-info">
        <div>
          <strong>🔒 ملاحظات مهمة - Important Notes:</strong>
          <ul
            style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}
          >
            <li>جميع البيانات محفوظة محلياً في المتصفح</li>
            <li>تأكد من عمل نسخة احتياطي بانتظام باستخدام "تصدير البيانات"</li>
            <li>مسح بيانات المتصفح سيؤدي إلى فقدان جميع البيانات</li>
            <li>الإعدادات تطبق على جميع المسابقات الجديدة</li>
            <li>All data is stored locally in the browser</li>
            <li>Make sure to backup regularly using "Export Data"</li>
            <li>Clearing browser data will result in losing all data</li>
            <li>Settings apply to all new competitions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
