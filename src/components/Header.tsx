import React from "react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateNewForm: () => void;
}

function Header({ searchTerm, onSearchChange, onCreateNewForm }: HeaderProps) {
  return (
    <header className="main-header">
      <div className="header-text">
        <h1>Мои формы</h1>
        <p>Управляйте регистрациями на ваши мероприятия</p>
      </div>
      <div className="header-actions">
        <button className="primary-button" onClick={onCreateNewForm}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus-circle"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8"></path>
            <path d="M12 8v8"></path>
          </svg>
          Новая форма
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск форм…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
        </div>
      </div>
    </header>
  );
}

export default Header;
