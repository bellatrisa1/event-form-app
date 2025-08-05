import React, { JSX } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query"; // Добавьте импорт
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Sort from "./components/Sort";
import Card from "./components/Card";
import Analytics from "./components/Analytics";
import CreateForm from "./components/CreateForm";
import RegistrationForm from "./components/RegistrationForm";
import EditForm from "./components/EditForm";
import FormAnalytics from "./components/FormAnalytics";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";
import { seedForms } from "./utils/seedDatabase";
import { useForms } from "./hooks/useForms";
import "./scss/main.scss";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();


  console.log("ProtectedRoute: ", {
    user,
    loading,
    location: location.pathname,
  });


  if (loading) {
    return (
      <div className="app-container">
        <div className="container">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Используйте хук
  const {
    forms,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    handleClone,
    handleDelete,
  } = useForms();

  const handleSeedDatabase = async () => {
    try {
      await seedForms();
      await queryClient.invalidateQueries({ queryKey: ["forms"] });
    } catch (err) {
      console.error("Seed error:", err);
    }
  };

  const handleCreateNewForm = () => {
    navigate("/create");
  };

  const handleEdit = (formId: string) => {
    navigate(`/edit/${formId}`);
  };

  const handleAnalyze = (formId: string) => {
    navigate(`/analytics/${formId}`);
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="container">Загрузка форм...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="container">Ошибка: {(error as Error).message}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateNewForm={handleCreateNewForm}
        />
        <section className="forms-section">
          <div className="actions-row">
            <button className="primary-button" onClick={handleSeedDatabase}>
              Seed Database
            </button>
            <button className="secondary-button" onClick={logout}>
              Выйти
            </button>
          </div>
          <Sort
            onSortChange={setSortOption}
            selectedSort={sortOption}
            totalForms={forms.length}
          />
          <div className="forms-grid">
            {forms.length > 0 ? (
              forms.map((form) => (
                <Card
                  key={form.id}
                  title={form.title}
                  responses={form.submissions}
                  lastUpdated={form.lastUpdated}
                  icon={form.icon}
                  color={form.color}
                  onEdit={() => handleEdit(form.id)}
                  onAnalyze={() => handleAnalyze(form.id)}
                  onClone={() => handleClone(form.id)}
                  onDelete={() => handleDelete(form.id)}
                />
              ))
            ) : (
              <p>Формы не найдены</p>
            )}
          </div>
          <Analytics forms={forms} />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:id"
        element={
          <ProtectedRoute>
            <FormAnalytics />
          </ProtectedRoute>
        }
      />
      <Route path="/form/:id" element={<RegistrationForm />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      /> */}
      <Route path="/profile" element={<Profile />} />
      
      {/* <Route path="/" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;
