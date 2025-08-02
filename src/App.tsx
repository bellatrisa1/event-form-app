// src/App.tsx
import React, { JSX, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Sort from "./components/Sort";
import Card from "./components/Card";
import Analytics from "./components/Analytics";
import CreateForm from "./components/CreateForm";
import RegistrationForm from "./components/RegistrationForm";
import EditForm from "./components/EditForm";
import FormAnalytics from "./components/FormAnalytics";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";
import { fetchForms } from "./api/formApi";
import { FormItem } from "./types";
import { seedForms } from "./utils/seedDatabase";
import "./scss/main.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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
};

function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("date");

  const {
    data: forms = [],
    isLoading,
    error,
    refetch,
  } = useQuery<FormItem[]>({
    queryKey: ["forms"],
    queryFn: fetchForms,
  });

  const handleSeedDatabase = async () => {
    try {
      await seedForms();
      await refetch();
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

  const handleClone = (formId: string) => {
    console.log("Clone form:", formId);
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

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedForms = [...filteredForms].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "alphabet") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "submissions") {
      return b.submissions - a.submissions;
    }
    return 0;
  });

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
            totalForms={sortedForms.length}
          />
          <div className="forms-grid">
            {sortedForms.length > 0 ? (
              sortedForms.map((form) => (
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
                />
              ))
            ) : (
              <p>Формы не найдены</p>
            )}
          </div>
          <Analytics forms={sortedForms} />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppWithProviders;
