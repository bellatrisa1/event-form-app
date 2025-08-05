import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { FiMail } from "react-icons/fi";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Письмо для сброса пароля отправлено!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Ошибка при отправке письма");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Сброс пароля</h2>
        <p>Введите email для получения ссылки на сброс пароля</p>
        <form onSubmit={handleReset}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <button type="submit" className="login-button">
            Отправить
          </button>
        </form>
        <p>
          <a href="/login">Вернуться к входу</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
