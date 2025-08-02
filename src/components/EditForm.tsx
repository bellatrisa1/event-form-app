// src/components/EditForm.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types";
import { updateForm } from "../api/formApi";
import { useQueryClient } from "@tanstack/react-query";

const ICON_OPTIONS = [
  { value: "users", label: "Участники", icon: "👥" },
  { value: "mic", label: "Микрофон", icon: "🎤" },
  { value: "book-open", label: "Лекция", icon: "📖" },
  { value: "calendar", label: "Календарь", icon: "📅" },
] as const;

const COLOR_OPTIONS = [
  { value: "orange", label: "Оранжевый", color: "#FFEDD5" },
  { value: "purple", label: "Фиолетовый", color: "#EEF2FF" },
  { value: "blue", label: "Синий", color: "#EFF6FF" },
  { value: "green", label: "Зелёный", color: "#ECFCCB" },
  { value: "red", label: "Красный", color: "#FEE2E2" },
] as const;

const EditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<Pick<FormItem, "title" | "icon" | "color">>({
    title: "",
    icon: "users",
    color: "orange",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;
      try {
        const formRef = doc(db, "forms", id);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          const data = formSnap.data();
          setForm({
            title: data.title || "",
            icon: data.icon || "users",
            color: data.color || "orange",
          });
        } else {
          setError("Форма не найдена.");
        }
      } catch (err) {
        setError("Ошибка загрузки формы: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Введите название формы.");
      return;
    }

    if (!id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateForm(id, {
        title: form.title,
        icon: form.icon,
        color: form.color,
      });
      await queryClient.invalidateQueries({ queryKey: ["forms"] });
      navigate("/dashboard");
    } catch (err) {
      setError("Ошибка сохранения: " + (err as Error).message);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container">Загрузка формы...</div>;
  }

  return (
    <div className="container">
      <h1>Редактировать форму</h1>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Название формы"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label>Иконка</label>
          <select name="icon" value={form.icon} onChange={handleChange}>
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Цвет</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <label key={c.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="color"
                  value={c.value}
                  checked={form.color === c.value}
                  onChange={handleChange}
                />
                <span
                  style={{
                    backgroundColor: c.color,
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                  }}
                ></span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/dashboard")}
            disabled={isSubmitting}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
