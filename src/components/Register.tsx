import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FiMail, FiLock } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email уже используется");
      } else if (err.code === "auth/weak-password") {
        setError("Пароль слишком слабый (минимум 6 символов)");
      } else {
        setError("Ошибка регистрации");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError("Ошибка входа через Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-icon">📝</div>
        <h2>Регистрация</h2>
        <p>Создайте аккаунт</p>
        <form onSubmit={handleRegister}>
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
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Зарегистрироваться"
            )}
          </button>
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleRegister}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 12c0-1.66 1.34-3 3-3h6c1.66 0 3 1.34 3 3s-1.34 3-3 3H9c-1.66 0-3-1.34-3-3z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 6c1.66 0 3 1.34 3 3v6c0 1.66-1.34 3-3 3s-3-1.34-3-3V9c0-1.66 1.34-3 3-3z"
                    fill="#34A853"
                  />
                  <path
                    d="M18 12c0-1.66-1.34-3-3-3H9c-1.66 0-3 1.34-3 3v6c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3v-6z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 18c-1.66 0-3-1.34-3-3V9c0-1.66 1.34-3 3-3s3 1.34 3 3v6c0 1.66-1.34 3-3 3z"
                    fill="#EA4335"
                  />
                </svg>
                Регистрация через Google
              </>
            )}
          </button>
        </form>
        <div className="register-links">
          <p>
            Уже есть аккаунт? <a href="/login">Войти</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
