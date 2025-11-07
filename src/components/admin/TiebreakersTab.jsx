/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Zap,
  Search,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import QuestionModal from "../common/QuestionModal";

const TiebreakersTab = () => {
  const { state, dispatch } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTiebreaker, setEditingTiebreaker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSave = async (tiebreakerData) => {
    try {
      if (editingTiebreaker) {
        // Update existing tiebreaker
        dispatch({
          type: "UPDATE_TIEBREAKER",
          payload: { ...tiebreakerData, id: editingTiebreaker.id },
        });
        showMessage(
          "success",
          "تم تحديث السؤال الفاصل بنجاح - Tiebreaker updated successfully"
        );
      } else {
        // Add new tiebreaker
        dispatch({
          type: "ADD_TIEBREAKER",
          payload: tiebreakerData,
        });
        showMessage(
          "success",
          "تم إضافة السؤال الفاصل بنجاح - Tiebreaker added successfully"
        );
      }
      setModalOpen(false);
      setEditingTiebreaker(null);
    } catch (error) {
      showMessage("error", "حدث خطأ أثناء الحفظ - Error occurred while saving");
    }
  };

  const handleEdit = (tiebreaker) => {
    setEditingTiebreaker(tiebreaker);
    setModalOpen(true);
  };

  const handleDelete = (tiebreakerId, tiebreakerText) => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف هذا السؤال الفاصل؟\n"${tiebreakerText}"`
      )
    ) {
      return;
    }

    try {
      dispatch({ type: "DELETE_TIEBREAKER", payload: tiebreakerId });
      showMessage(
        "success",
        "تم حذف السؤال الفاصل بنجاح - Tiebreaker deleted successfully"
      );
    } catch (error) {
      showMessage(
        "error",
        "حدث خطأ أثناء الحذف - Error occurred while deleting"
      );
    }
  };

  const handleAddNew = () => {
    setEditingTiebreaker(null);
    setModalOpen(true);
  };

  // Filter tiebreakers based on search
  const filteredTiebreakers = Object.values(state.tiebreakers).filter(
    (tiebreaker) => {
      return (
        !searchTerm ||
        tiebreaker.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tiebreaker.questionEn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

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
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Zap size={28} style={{ color: "#dc3545" }} />
            إدارة الأسئلة الفاصلة
          </h3>
          <p style={{ color: "#666", margin: 0 }}>
            Manage Tiebreaker Questions
          </p>
        </div>
        <button
          className="btn"
          onClick={handleAddNew}
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
          }}
        >
          <Plus size={20} />
          إضافة سؤال فاصل
        </button>
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

      {/* Info Card */}
      <div
        className="card"
        style={{
          marginBottom: "20px",
          background: "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
          color: "white",
        }}
      >
        <h5
          style={{
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Zap size={20} />
          ما هي الأسئلة الفاصلة؟ - What are Tiebreaker Questions?
        </h5>
        <p style={{ margin: 0, lineHeight: "1.6" }}>
          الأسئلة الفاصلة تُستخدم في حالة التعادل بين الفرق لتحديد الفائز. هذه
          الأسئلة عادة ما تكون أكثر صعوبة ولها وقت أقل للإجابة.
          <br />
          <em>
            Tiebreaker questions are used when teams are tied to determine the
            winner. These questions are usually more challenging and have less
            time to answer.
          </em>
        </p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: "20px", padding: "15px" }}>
        <div className="input-group">
          <label>البحث في الأسئلة الفاصلة</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في النص العربي أو الإنجليزي..."
              style={{ paddingLeft: "40px" }}
            />
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          عرض {filteredTiebreakers.length} من أصل{" "}
          {Object.keys(state.tiebreakers).length} سؤال فاصل
        </div>
      </div>

      {/* Tiebreakers List */}
      {Object.keys(state.tiebreakers).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Zap size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
          <h4 style={{ color: "#666" }}>لا توجد أسئلة فاصلة</h4>
          <p style={{ color: "#999", marginBottom: "20px" }}>
            ابدأ بإضافة سؤال فاصل للاستخدام في حالات التعادل
            <br />
            Start by adding a tiebreaker question for use in tied situations
          </p>
          <button
            className="btn"
            onClick={handleAddNew}
            style={{
              background: "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
            }}
          >
            <Plus size={20} />
            إضافة أول سؤال فاصل
          </button>
        </div>
      ) : filteredTiebreakers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Search size={48} style={{ color: "#ccc", marginBottom: "15px" }} />
          <h4 style={{ color: "#666" }}>لا توجد نتائج</h4>
          <p style={{ color: "#999" }}>
            لم يتم العثور على أسئلة فاصلة تطابق معايير البحث
            <br />
            No tiebreaker questions found matching your search criteria
          </p>
        </div>
      ) : (
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {filteredTiebreakers.map((tiebreaker, index) => (
            <div
              key={tiebreaker.id}
              className="card"
              style={{
                marginBottom: "15px",
                border: "2px solid #dc3545",
                borderRadius: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  {/* Tiebreaker Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Zap size={14} />
                      سؤال فاصل #{index + 1}
                    </div>
                    <div
                      style={{
                        background: "#fff3cd",
                        color: "#856404",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      ⏱️ {state.settings.tiebreakerTimer} ثانية
                    </div>
                  </div>

                  {/* Question Text */}
                  <h4
                    style={{
                      marginBottom: "8px",
                      color: "#dc3545",
                      lineHeight: "1.4",
                    }}
                  >
                    {tiebreaker.question}
                  </h4>
                  <p
                    style={{
                      opacity: 0.7,
                      marginBottom: "15px",
                      fontSize: "14px",
                    }}
                  >
                    {tiebreaker.questionEn}
                  </p>

                  {/* Correct Answer */}
                  <div style={{ marginBottom: "10px" }}>
                    <strong style={{ color: "#28a745", fontSize: "14px" }}>
                      ✓ الإجابة الصحيحة:
                    </strong>
                    <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {tiebreaker.options[tiebreaker.correct]}
                    </span>
                  </div>

                  {/* All Options */}
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    <strong>جميع الخيارات:</strong>
                    <div style={{ marginTop: "5px" }}>
                      {tiebreaker.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          style={{
                            marginBottom: "3px",
                            color:
                              optionIndex === tiebreaker.correct
                                ? "#28a745"
                                : "#666",
                            fontWeight:
                              optionIndex === tiebreaker.correct
                                ? "bold"
                                : "normal",
                          }}
                        >
                          {optionIndex + 1}. {option}
                          {optionIndex === tiebreaker.correct && " ✓"}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  {tiebreaker.explanation && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        background: "#f8f9fa",
                        borderRadius: "5px",
                      }}
                    >
                      <strong style={{ fontSize: "13px", color: "#dc3545" }}>
                        التفسير:
                      </strong>
                      <p
                        style={{
                          margin: "5px 0 0 0",
                          fontSize: "13px",
                          color: "#666",
                        }}
                      >
                        {tiebreaker.explanation}
                      </p>
                      {tiebreaker.explanationEn && (
                        <p
                          style={{
                            margin: "5px 0 0 0",
                            fontSize: "13px",
                            color: "#666",
                            fontStyle: "italic",
                          }}
                        >
                          {tiebreaker.explanationEn}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginLeft: "15px",
                  }}
                >
                  <button
                    className="btn btn-outline"
                    onClick={() => handleEdit(tiebreaker)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "14px",
                      borderColor: "#dc3545",
                      color: "#dc3545",
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(tiebreaker.id, tiebreaker.question)
                    }
                    style={{ padding: "8px 12px", fontSize: "14px" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <QuestionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTiebreaker(null);
        }}
        onSave={handleSave}
        initial={editingTiebreaker}
        isTriebreaker={true}
      />

      {/* Instructions */}
      <div className="alert alert-info" style={{ marginTop: "30px" }}>
        <div>
          <strong>💡 تعليمات الأسئلة الفاصلة:</strong>
          <ul
            style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}
          >
            <li>الأسئلة الفاصلة لا تحتاج إلى تصنيف محدد</li>
            <li>يُفضل أن تكون أكثر صعوبة من الأسئلة العادية</li>
            <li>
              الوقت المخصص لها أقل من الأسئلة العادية (
              {state.settings.tiebreakerTimer} ثانية)
            </li>
            <li>تُستخدم فقط في حالات التعادل بين الفرق</li>
            <li>يُنصح بوجود 5-10 أسئلة فاصلة على الأقل</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TiebreakersTab;
