/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import CategoryModal from "../common/CategoryModal";

const CategoriesTab = () => {
  const { state, dispatch } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSave = async (categoryData) => {
    try {
      if (editingCategory) {
        // Update existing category
        dispatch({
          type: "UPDATE_CATEGORY",
          payload: { ...categoryData, id: editingCategory.id },
        });
        showMessage(
          "success",
          "تم تحديث التصنيف بنجاح - Category updated successfully"
        );
      } else {
        // Add new category
        dispatch({
          type: "ADD_CATEGORY",
          payload: categoryData,
        });
        showMessage(
          "success",
          "تم إضافة التصنيف بنجاح - Category added successfully"
        );
      }
      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      showMessage("error", "حدث خطأ أثناء الحفظ - Error occurred while saving");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (categoryId, categoryName) => {
    // Check if category has questions
    const categoryQuestions = Object.values(state.questions).filter(
      (q) => q.category === categoryId
    );

    if (categoryQuestions.length > 0) {
      if (
        !window.confirm(
          `هذا التصنيف يحتوي على ${categoryQuestions.length} سؤال. هل أنت متأكد من الحذف؟\n` +
            `This category contains ${categoryQuestions.length} questions. Are you sure you want to delete it?\n\n` +
            `سيتم حذف جميع الأسئلة المرتبطة بهذا التصنيف.\n` +
            `All questions associated with this category will be deleted.`
        )
      ) {
        return;
      }

      // Delete all questions in this category first
      categoryQuestions.forEach((question) => {
        dispatch({ type: "DELETE_QUESTION", payload: question.id });
      });
    } else {
      if (!window.confirm(`هل أنت متأكد من حذف التصنيف "${categoryName}"؟`)) {
        return;
      }
    }

    try {
      dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
      showMessage(
        "success",
        "تم حذف التصنيف بنجاح - Category deleted successfully"
      );
    } catch (error) {
      showMessage(
        "error",
        "حدث خطأ أثناء الحذف - Error occurred while deleting"
      );
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const getQuestionCount = (categoryId) => {
    return Object.values(state.questions).filter(
      (q) => q.category === categoryId
    ).length;
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
          <h3>إدارة التصنيفات</h3>
          <p style={{ color: "#666", margin: 0 }}>Manage Categories</p>
        </div>
        <button className="btn" onClick={handleAddNew}>
          <Plus size={20} />
          إضافة تصنيف
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

      {Object.keys(state.categories).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <BookOpen size={64} style={{ color: "#ccc", marginBottom: "20px" }} />
          <h4 style={{ color: "#666" }}>لا توجد تصنيفات</h4>
          <p style={{ color: "#999", marginBottom: "20px" }}>
            ابدأ بإضافة تصنيف جديد لتنظيم الأسئلة
            <br />
            Start by adding a new category to organize questions
          </p>
          <button className="btn" onClick={handleAddNew}>
            <Plus size={20} />
            إضافة أول تصنيف
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {Object.entries(state.categories).map(([id, category]) => {
            const questionCount = getQuestionCount(id);
            return (
              <div key={id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
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
                          width: "40px",
                          height: "40px",
                          background:
                            "linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: "#2d5016" }}>
                          {category.name}
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}
                        >
                          {category.nameEn}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <div
                        style={{
                          background: questionCount > 0 ? "#e8f5e8" : "#f8f9fa",
                          color: questionCount > 0 ? "#2d5016" : "#666",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          display: "inline-block",
                        }}
                      >
                        📝 {questionCount} سؤال
                      </div>
                    </div>

                    {category.icon && (
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        <strong>الأيقونة:</strong> {category.icon}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <button
                      className="btn btn-outline"
                      onClick={() => handleEdit(category)}
                      style={{ padding: "8px 12px", fontSize: "14px" }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(id, category.name)}
                      style={{ padding: "8px 12px", fontSize: "14px" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {questionCount > 0 && (
                  <div
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      هذا التصنيف يحتوي على {questionCount} سؤال. حذف التصنيف
                      سيحذف جميع الأسئلة المرتبطة به.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        initial={editingCategory}
      />

      {/* Instructions */}
      <div className="alert alert-info" style={{ marginTop: "30px" }}>
        <div>
          <strong>💡 تعليمات:</strong>
          <ul
            style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}
          >
            <li>التصنيفات تساعد في تنظيم الأسئلة حسب المواضيع</li>
            <li>يجب إدخال الاسم باللغتين العربية والإنجليزية</li>
            <li>حذف التصنيف سيحذف جميع الأسئلة المرتبطة به</li>
            <li>يمكن تعديل التصنيفات في أي وقت</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
