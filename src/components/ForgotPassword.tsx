import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { FiMail } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Письмо отправлено! Проверьте почту.");
    } catch (err: any) {
      setError("Email не найден или ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-icon">🔑</div>
        <h2>Сброс пароля</h2>
        <p>Введите email для получения ссылки</p>
        <form onSubmit={handleReset}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <button
            type="submit"
            className="forgot-password-button"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Отправить"}
          </button>
        </form>
        <div className="forgot-password-links">
          <a href="/login">Вернуться к входу</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
