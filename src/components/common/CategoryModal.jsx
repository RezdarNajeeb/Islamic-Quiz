/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { validateCategory } from "../../utils/dataService";

const CategoryModal = ({ open, onClose, onSave, initial }) => {
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    icon: "BookOpen",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        setFormData({
          name: initial.name || "",
          nameEn: initial.nameEn || "",
          icon: initial.icon || "BookOpen",
        });
      } else {
        setFormData({
          name: "",
          nameEn: "",
          icon: "BookOpen",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const validation = validateCategory(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const categoryData = {
        ...formData,
        id: initial?.id,
        updatedAt: new Date().toISOString(),
      };

      if (!initial) {
        categoryData.createdAt = new Date().toISOString();
      }

      await onSave(categoryData);
      onClose();
    } catch (error) {
      setErrors(["حدث خطأ أثناء الحفظ - Error occurred while saving"]);
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3>{initial ? "تعديل التصنيف" : "إضافة تصنيف"}</h3>
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
          <div className="input-group">
            <label>اسم التصنيف (عربي) *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="مثال: القرآن الكريم"
              required
            />
          </div>

          <div className="input-group">
            <label>Category Name (English) *</label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => handleInputChange("nameEn", e.target.value)}
              placeholder="Example: Holy Quran"
              required
            />
          </div>

          <div className="input-group">
            <label>الأيقونة (Icon name)</label>
            <select
              value={formData.icon}
              onChange={(e) => handleInputChange("icon", e.target.value)}
            >
              <option value="BookOpen">BookOpen</option>
              <option value="Brain">Brain</option>
              <option value="Star">Star</option>
              <option value="Clock">Clock</option>
              <option value="Heart">Heart</option>
              <option value="Globe">Globe</option>
              <option value="Shield">Shield</option>
              <option value="Target">Target</option>
              <option value="Users">Users</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              className="btn"
              disabled={loading || !formData.name || !formData.nameEn}
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

export default CategoryModal;
