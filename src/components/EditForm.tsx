import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types/index";
import { updateForm } from "../api/formApi";
import { useQueryClient } from "@tanstack/react-query";
import { ICON_OPTIONS, COLOR_OPTIONS } from "../constants/options";

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
      if (!id) {
        setError("ID формы не указан.");
        setLoading(false);
        return;
      }
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
    if (form.title.length > 50) {
      setError("Название формы не должно превышать 50 символов.");
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

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          Назад
        </button>
      </div>
    );
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
            aria-required="true"
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
                  className="sr-only"
                />
                <span
                  style={{
                    backgroundColor: c.color,
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                  }}
                ></span>
                {c.label}
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
            aria-label="Сохранить форму"
          >
            {isSubmitting ? "Сохранение..." : "Сохранить"}
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

export default EditForm;
