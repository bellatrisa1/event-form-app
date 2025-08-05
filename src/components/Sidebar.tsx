/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { List, BarChart, User, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Link } from "react-router-dom";

function Sidebar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="#7C3AED"
                opacity="0.1"
              ></circle>
              <path
                d="M8 9l4 4 4-4"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          <span className="logo-text">EventForms</span>
        </div>
        <nav className="navigation">
          {/* <Link to="/" className="nav-link active">
            <List className="icon" /> Мои формы
          </Link> */}
          <Link to="/" className="nav-link">
            <BarChart className="icon" /> Аналитика
          </Link>
          <Link to="/profile" className="nav-link">
            <User className="icon" /> Профиль
          </Link>
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="footer-divider">
          <a href="#" className="logout-link" onClick={handleLogout}>
            <LogOut className="icon" /> Выйти
          </a>
        </div>
        <div className="copyright">© 2024 EventForms</div>
      </div>
    </aside>
  );
}

export default Sidebar;
