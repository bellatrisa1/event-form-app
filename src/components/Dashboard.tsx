import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// ✅ Fixed: Import deleteForm
import { fetchForms, deleteForm } from "../api/formApi";
import { useAuth } from "../context/AuthContext";

import { FormItem } from "../types";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Sort from "./Sort";
import Card from "./Card";
import Analytics from "./Analytics";
import { ClipLoader } from "react-spinners";

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // ✅ Added useNavigate

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<
    "date" | "alphabet" | "submissions"
  >("date");

  const {
    data: forms = [],
    isLoading,
    error,
  } = useQuery<FormItem[]>({
    queryKey: ["forms"],
    queryFn: fetchForms,
  });

  // ✅ Fixed: Now deleteForm is imported
  const handleDelete = async (formId: string) => {
    if (window.confirm("Удалить форму?")) {
      try {
        await deleteForm(formId);
        queryClient.invalidateQueries({ queryKey: ["forms"] });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // ✅ Fixed: navigate is now defined
  const handleEdit = (formId: string) => navigate(`/edit/${formId}`);
  const handleAnalyze = (formId: string) => navigate(`/analytics/${formId}`);
  const handleClone = (formId: string) => console.log("Clone:", formId);

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedForms = [...filteredForms].sort((a, b) => {
    if (sortOption === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOption === "alphabet") return a.title.localeCompare(b.title);
    if (sortOption === "submissions") return b.submissions - a.submissions;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="container">
            <ClipLoader color="#ea580c" />
          </div>
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
          onCreateNewForm={() => navigate("/create")} // ✅ navigate used correctly
        />
        <section className="forms-section">
          <div className="actions-row">
            <button className="secondary-button" onClick={logout}>
              Выйти
            </button>
          </div>
          <Sort
            onSortChange={setSortOption} // ✅ Now types match (see fix below)
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
                  onDelete={() => handleDelete(form.id)}
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
};

export default Dashboard;
