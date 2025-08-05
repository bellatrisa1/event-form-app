import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const location = useLocation();
console.log("Profile component rendered:", {
  user,
  location: location.pathname,
});

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile(user, { displayName });
      setSuccess("Профиль обновлен!");
    } catch (err: any) {
      setError(err.message || "Ошибка обновления профиля");
    }
  };

  return (
    <div className="container">
      <h1>Профиль</h1>
      <form onSubmit={handleUpdate} className="registration-form">
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user?.email || ""} disabled />
        </div>
        <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ваше имя"
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="form-actions">
          <button type="submit" className="primary-button">
            Сохранить
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Назад
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
