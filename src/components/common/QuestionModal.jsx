/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { validateQuestion } from "../../utils/dataService";
import { useGame } from "../../context/GameContext";

const QuestionModal = ({
  open,
  onClose,
  onSave,
  initial,
  isTriebreaker = false,
}) => {
  const { state } = useGame();
  const [formData, setFormData] = useState({
    category: "",
    question: "",
    questionEn: "",
    options: ["", "", "", ""],
    optionsEn: ["", "", "", ""],
    correct: 0,
    explanation: "",
    explanationEn: "",
    difficulty: "medium",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        setFormData({
          category: initial.category || "",
          question: initial.question || "",
          questionEn: initial.questionEn || "",
          options: initial.options || ["", "", "", ""],
          optionsEn: initial.optionsEn || ["", "", "", ""],
          correct: initial.correct || 0,
          explanation: initial.explanation || "",
          explanationEn: initial.explanationEn || "",
          difficulty: initial.difficulty || "medium",
        });
      } else {
        setFormData({
          category: "",
          question: "",
          questionEn: "",
          options: ["", "", "", ""],
          optionsEn: ["", "", "", ""],
          correct: 0,
          explanation: "",
          explanationEn: "",
          difficulty: "medium",
        });
      }
      setErrors([]);
    }
  }, [open, initial]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (index, value, isEnglish = false) => {
    const optionsKey = isEnglish ? "optionsEn" : "options";
    setFormData((prev) => ({
      ...prev,
      [optionsKey]: prev[optionsKey].map((option, i) =>
        i === index ? value : option
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Skip category validation for tiebreakers
    const dataToValidate = isTriebreaker
      ? { ...formData, category: "tiebreaker" }
      : formData;

    const validation = validateQuestion(dataToValidate);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const questionData = {
        ...formData,
        id: initial?.id,
        updatedAt: new Date().toISOString(),
      };

      if (!initial) {
        questionData.createdAt = new Date().toISOString();
      }

      await onSave(questionData);
      onClose();
    } catch (error) {
      setErrors(["حدث خطأ أثناء الحفظ - Error occurred while saving"]);
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        style={{ maxWidth: "700px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3>
            {initial
              ? isTriebreaker
                ? "تعديل سؤال فاصل"
                : "تعديل السؤال"
              : isTriebreaker
              ? "إضافة سؤال فاصل"
              : "إضافة سؤال"}
          </h3>
          <button
            className="btn btn-outline"
            onClick={onClose}
            style={{ padding: "8px 12px" }}
          >
            <X size={16} />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-error">
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isTriebreaker && (
            <div className="input-group">
              <label>التصنيف *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
              >
                <option value="">اختر التصنيف</option>
                {Object.entries(state.categories).map(([id, category]) => (
                  <option key={id} value={id}>
                    {category.name} - {category.nameEn}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group">
            <label>السؤال (عربي) *</label>
            <textarea
              value={formData.question}
              onChange={(e) => handleInputChange("question", e.target.value)}
              rows="3"
              placeholder="أدخل السؤال باللغة العربية"
              required
            />
          </div>

          <div className="input-group">
            <label>Question (English) *</label>
            <textarea
              value={formData.questionEn}
              onChange={(e) => handleInputChange("questionEn", e.target.value)}
              rows="3"
              placeholder="Enter question in English"
              required
            />
          </div>

          <div className="input-group">
            <label>الخيارات (عربي) *</label>
            {formData.options.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ minWidth: "20px", fontWeight: "bold" }}>
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`الخيار ${index + 1}`}
                  required
                />
                <input
                  type="radio"
                  name="correct"
                  checked={formData.correct === index}
                  onChange={() => handleInputChange("correct", index)}
                  title="الإجابة الصحيحة"
                />
              </div>
            ))}
          </div>

          <div className="input-group">
            <label>Options (English) *</label>
            {formData.optionsEn.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span style={{ minWidth: "20px", fontWeight: "bold" }}>
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value, true)
                  }
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="input-group">
            <label>التفسير (عربي)</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => handleInputChange("explanation", e.target.value)}
              rows="2"
              placeholder="تفسير الإجابة الصحيحة (اختياري)"
            />
          </div>

          <div className="input-group">
            <label>Explanation (English)</label>
            <textarea
              value={formData.explanationEn}
              onChange={(e) =>
                handleInputChange("explanationEn", e.target.value)
              }
              rows="2"
              placeholder="Explanation of the correct answer (optional)"
            />
          </div>

          {!isTriebreaker && (
            <div className="input-group">
              <label>مستوى الصعوبة</label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
              >
                <option value="easy">سهل - Easy</option>
                <option value="medium">متوسط - Medium</option>
                <option value="hard">صعب - Hard</option>
              </select>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              className="btn"
              disabled={loading || !formData.question || !formData.questionEn}
            >
              {loading ? (
                <div className="loading"></div>
              ) : (
                <>
                  <Save size={16} />
                  حفظ
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
