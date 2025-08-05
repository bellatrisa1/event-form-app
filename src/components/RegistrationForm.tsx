import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types/index";
import { getIcon, getColorBg, getColorText } from "../utils/formUtils";

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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) {
        setError("ID формы не указан.");
        setLoading(false);
        return;
      }
      try {
        const formDoc = doc(db, "forms", id);
        const formSnap = await getDoc(formDoc);

        if (formSnap.exists()) {
          setForm({ id: formSnap.id, ...formSnap.data() } as FormItem);
        } else {
          setError("Форма не найдена.");
        }
      } catch (err) {
        setError("Не удалось загрузить форму: " + (err as Error).message);
      } finally {
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
    if (!formData.name.trim()) {
      setError("Пожалуйста, введите имя.");
      return;
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError("Пожалуйста, введите корректный email.");
      return;
    }

    if (!id) return;

    try {
      await addDoc(collection(db, "registrations"), {
        formId: id,
        ...formData,
        submittedAt: serverTimestamp(),
      });

      const formRef = doc(db, "forms", id);
      await updateDoc(formRef, {
        submissions: form?.submissions ? form.submissions + 1 : 1,
        lastUpdated: serverTimestamp(),
      });

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
        <button className="secondary-button" onClick={() => navigate("/")}>
          Назад
        </button>
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
              aria-required="true"
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
              aria-required="true"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              aria-label="Зарегистрироваться"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
