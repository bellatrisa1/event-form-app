import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types";

const RegistrationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) return;
      try {
        const formDoc = doc(db, "forms", id);
        const formSnap = await getDoc(formDoc);

        if (formSnap.exists()) {
          setForm({ id: formSnap.id, ...formSnap.data() } as FormItem);
          setLoading(false);
        } else {
          setError("Форма не найдена.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Ошибка загрузки формы:", err);
        setError("Не удалось загрузить форму.");
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    if (!id) return;

    try {
      await addDoc(collection(db, "registrations"), {
        formId: id,
        ...formData,
        submittedAt: serverTimestamp(),
      });

      // Обновим количество ответов в форме
      // (можно позже сделать через Cloud Function, но пока просто UI-обновление)
      // В реальном проекте — лучше обновлять `submissions` через Cloud Function при добавлении регистрации

      setSubmitSuccess(true);
      setError(null);
    } catch (err) {
      setError("Ошибка отправки: " + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="registration-container">
        <div className="container">Загрузка формы...</div>
      </div>
    );
  }

  if (error && !submitSuccess) {
    return (
      <div className="registration-container">
        <div className="container error">{error}</div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="registration-container">
        <div className="container success-container">
          <h2>✅ Спасибо за регистрацию!</h2>
          <p>
            Ваша заявка на мероприятие <strong>{form?.title}</strong> успешно
            отправлена.
          </p>
          <button className="primary-button" onClick={() => navigate("/")}>
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="container">
        <div
          className="form-header"
          style={{ backgroundColor: getColorBg(form?.color) }}
        >
          <div className="icon" style={{ color: getColorText(form?.color) }}>
            {getIcon(form?.icon)}
          </div>
          <h1>{form?.title}</h1>
          <p>Заполните форму ниже, чтобы зарегистрироваться на мероприятие.</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Ваше имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Вспомогательные функции
function getIcon(iconName?: string) {
  switch (iconName) {
    case "users":
      return "👥";
    case "mic":
      return "🎤";
    case "book-open":
      return "📖";
    case "calendar":
      return "📅";
    default:
      return "🎫";
  }
}

function getColorBg(color?: string) {
  const colors: Record<string, string> = {
    orange: "#ffedd5",
    purple: "#eeecfe",
    blue: "#eff6ff",
    green: "#ecfccb",
    red: "#fee2e2",
  };
  return colors[color || "orange"];
}

function getColorText(color?: string) {
  const colors: Record<string, string> = {
    orange: "#9a3412",
    purple: "#5b21b6",
    blue: "#1e40af",
    green: "#166534",
    red: "#b91c1c",
  };
  return colors[color || "orange"];
}

export default RegistrationForm;
