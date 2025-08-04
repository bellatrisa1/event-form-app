import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createForm } from "../api/formApi";
import { FormItem } from "../types";
import { ICON_OPTIONS, COLOR_OPTIONS } from "../constants/options";

interface FormData {
  title: string;
  icon: string;
  color: string;
}

const CreateForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    icon: "users",
    color: "orange",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title.trim()) {
      setError("Введите название формы.");
      return;
    }
    if (formData.title.length > 50) {
      setError("Название формы не должно превышать 50 символов.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newForm: Omit<FormItem, "id" | "createdAt"> = {
        title: formData.title.trim(),
        date: new Date().toISOString(),
        submissions: 0,
        lastUpdated: new Date().toISOString(),
        icon: formData.icon,
        color: formData.color,
      };

      await createForm(newForm);
      setSuccess("Форма успешно создана!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("Ошибка при создании формы: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Создать новую форму</h1>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="title">Название формы</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Например: Вечеринка выпускников"
            maxLength={50}
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="icon">Иконка</label>
          <select
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Цвет</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((colorOpt) => (
              <label
                key={colorOpt.value}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer ${
                  formData.color === colorOpt.value
                    ? "border-gray-800"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="color"
                  value={colorOpt.value}
                  checked={formData.color === colorOpt.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colorOpt.color }}
                ></span>
                {colorOpt.label}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
            aria-label="Создать форму"
          >
            {isSubmitting ? "Создание..." : "Создать форму"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
            disabled={isSubmitting}
            aria-label="Отмена"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
