/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FiMail, FiLock } from "react-icons/fi"; 

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Неверный email или пароль");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <span>➡️</span>
        </div>
        <h2>Авторизация</h2>
        <p>Войти с помощью почты</p>
        <form onSubmit={handleLogin}>
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
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="login-button">
            Войти
          </button>
        </form>
        <div className="login-links">
          <a href="#">
            Забыли пароль? <span>Сбросить</span>
          </a>
          <p>
            Нет аккаунта? <a href="/register">Зарегистрироваться</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
