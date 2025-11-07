/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Brain,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import QuestionModal from "../common/QuestionModal";

const QuestionsTab = () => {
  const { state, dispatch } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSave = async (questionData) => {
    try {
      if (editingQuestion) {
        // Update existing question
        dispatch({
          type: "UPDATE_QUESTION",
          payload: { ...questionData, id: editingQuestion.id },
        });
        showMessage(
          "success",
          "تم تحديث السؤال بنجاح - Question updated successfully"
        );
      } else {
        // Add new question
        dispatch({
          type: "ADD_QUESTION",
          payload: questionData,
        });
        showMessage(
          "success",
          "تم إضافة السؤال بنجاح - Question added successfully"
        );
      }
      setModalOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      showMessage("error", "حدث خطأ أثناء الحفظ - Error occurred while saving");
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setModalOpen(true);
  };

  const handleDelete = (questionId, questionText) => {
    if (!window.confirm(`هل أنت متأكد من حذف هذا السؤال؟\n"${questionText}"`)) {
      return;
    }

    try {
      dispatch({ type: "DELETE_QUESTION", payload: questionId });
      showMessage(
        "success",
        "تم حذف السؤال بنجاح - Question deleted successfully"
      );
    } catch (error) {
      showMessage(
        "error",
        "حدث خطأ أثناء الحذف - Error occurred while deleting"
      );
    }
  };

  const handleAddNew = () => {
    setEditingQuestion(null);
    setModalOpen(true);
  };

  // Filter questions based on search and filters
  const filteredQuestions = Object.values(state.questions).filter(
    (question) => {
      const matchesSearch =
        !searchTerm ||
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.questionEn.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || question.category === selectedCategory;
      const matchesDifficulty =
        !selectedDifficulty || question.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    }
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#28a745";
      case "medium":
        return "#ffc107";
      case "hard":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "سهل - Easy";
      case "medium":
        return "متوسط - Medium";
      case "hard":
        return "صعب - Hard";
      default:
        return "غير محدد";
    }
  };

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
          <h3>إدارة الأسئلة</h3>
          <p style={{ color: "#666", margin: 0 }}>Manage Questions</p>
        </div>
        <button className="btn" onClick={handleAddNew}>
          <Plus size={20} />
          إضافة سؤال
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

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: "20px", padding: "20px" }}>
        <h5
          style={{
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Filter size={20} />
          البحث والتصفية - Search & Filter
        </h5>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div className="input-group">
            <label>البحث في الأسئلة</label>
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

          <div className="input-group">
            <label>التصنيف</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">جميع التصنيفات</option>
              {Object.entries(state.categories).map(([id, category]) => (
                <option key={id} value={id}>
                  {category.name} - {category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>مستوى الصعوبة</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">جميع المستويات</option>
              <option value="easy">سهل - Easy</option>
              <option value="medium">متوسط - Medium</option>
              <option value="hard">صعب - Hard</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          عرض {filteredQuestions.length} من أصل{" "}
          {Object.keys(state.questions).length} سؤال
        </div>
      </div>

      {/* Questions List */}
      {Object.keys(state.questions).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Brain size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
          <h4 style={{ color: "#666" }}>لا توجد أسئلة</h4>
          <p style={{ color: "#999", marginBottom: "20px" }}>
            ابدأ بإضافة سؤال جديد للمسابقة
            <br />
            Start by adding a new question for the quiz
          </p>
          <button className="btn" onClick={handleAddNew}>
            <Plus size={20} />
            إضافة أول سؤال
          </button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <Search size={48} style={{ color: "#ccc", marginBottom: "15px" }} />
          <h4 style={{ color: "#666" }}>لا توجد نتائج</h4>
          <p style={{ color: "#999" }}>
            لم يتم العثور على أسئلة تطابق معايير البحث
            <br />
            No questions found matching your search criteria
          </p>
        </div>
      ) : (
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {filteredQuestions.map((question) => {
            const category = state.categories[question.category];
            return (
              <div
                key={question.id}
                className="card"
                style={{ marginBottom: "15px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {/* Question Header */}
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
                          background: getDifficultyColor(question.difficulty),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {getDifficultyLabel(question.difficulty)}
                      </div>
                      {category && (
                        <div
                          style={{
                            background: "#e8f5e8",
                            color: "#2d5016",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        >
                          {category.name}
                        </div>
                      )}
                    </div>

                    {/* Question Text */}
                    <h4
                      style={{
                        marginBottom: "8px",
                        color: "#2d5016",
                        lineHeight: "1.4",
                      }}
                    >
                      {question.question}
                    </h4>
                    <p
                      style={{
                        opacity: 0.7,
                        marginBottom: "15px",
                        fontSize: "14px",
                      }}
                    >
                      {question.questionEn}
                    </p>

                    {/* Correct Answer */}
                    <div style={{ marginBottom: "10px" }}>
                      <strong style={{ color: "#28a745", fontSize: "14px" }}>
                        ✓ الإجابة الصحيحة:
                      </strong>
                      <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                        {question.options[question.correct]}
                      </span>
                    </div>

                    {/* All Options */}
                    <div style={{ fontSize: "13px", color: "#666" }}>
                      <strong>جميع الخيارات:</strong>
                      <div style={{ marginTop: "5px" }}>
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "3px",
                              color:
                                index === question.correct ? "#28a745" : "#666",
                              fontWeight:
                                index === question.correct ? "bold" : "normal",
                            }}
                          >
                            {index + 1}. {option}
                            {index === question.correct && " ✓"}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          background: "#f8f9fa",
                          borderRadius: "5px",
                        }}
                      >
                        <strong style={{ fontSize: "13px", color: "#2d5016" }}>
                          التفسير:
                        </strong>
                        <p
                          style={{
                            margin: "5px 0 0 0",
                            fontSize: "13px",
                            color: "#666",
                          }}
                        >
                          {question.explanation}
                        </p>
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
                      onClick={() => handleEdit(question)}
                      style={{ padding: "8px 12px", fontSize: "14px" }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(question.id, question.question)
                      }
                      style={{ padding: "8px 12px", fontSize: "14px" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuestionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuestion(null);
        }}
        onSave={handleSave}
        initial={editingQuestion}
      />

      {/* Instructions */}
      <div className="alert alert-info" style={{ marginTop: "30px" }}>
        <div>
          <strong>💡 تعليمات:</strong>
          <ul
            style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}
          >
            <li>يجب إدخال السؤال والخيارات باللغتين العربية والإنجليزية</li>
            <li>اختر الإجابة الصحيحة بالنقر على الزر المجاور للخيار</li>
            <li>التفسير اختياري ولكنه مفيد للمتعلمين</li>
            <li>يمكن تصفية الأسئلة حسب التصنيف ومستوى الصعوبة</li>
            <li>استخدم البحث للعثور على أسئلة محددة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionsTab;
