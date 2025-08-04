import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem, RegistrationItem } from "../types/index";
import { fetchRegistrations } from "../api/formApi";
import Chart from "chart.js/auto";
import { ChartConfiguration } from "chart.js";

const FormAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormItem | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("ID формы не указан.");
        setLoading(false);
        return;
      }

      try {
        const formRef = doc(db, "forms", id);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setForm({ id: formSnap.id, ...formSnap.data() } as FormItem);
        } else {
          setError("Форма не найдена.");
        }

        const regs = await fetchRegistrations();
        setRegistrations(regs.filter((reg) => reg.formId === id));
      } catch (err) {
        setError("Ошибка загрузки данных: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!chartRef.current || !form || !registrations.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Группировка регистраций по дням
    const registrationCounts = registrations.reduce((acc, reg) => {
      const date = reg.submittedAt
        ? new Date(reg.submittedAt).toLocaleDateString("ru-RU")
        : "Unknown";
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(registrationCounts);
    const data = Object.values(registrationCounts);

    const config: ChartConfiguration<"bar"> = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Регистрации",
            data,
            backgroundColor: "rgba(124, 58, 237, 0.6)",
            borderColor: "#7C3AED",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Количество" },
          },
          x: { title: { display: true, text: "Дата" } },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [form, registrations]);

  if (loading) return <div className="container">Загрузка...</div>;
  if (error || !form) {
    return (
      <div className="container">
        <div className="error">{error || "Форма не найдена"}</div>
        <button
          className="secondary-button"
          onClick={() => window.history.back()}
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Аналитика: {form.title}</h1>

      <div className="analytics-grid" style={{ marginTop: "2rem" }}>
        <div className="stat-card orange" style={{ padding: "1rem" }}>
          <div className="stat-header">
            <span>Всего регистраций</span>
          </div>
          <div className="stat-value">{form.submissions}</div>
        </div>
        <div className="stat-card purple" style={{ padding: "1rem" }}>
          <div className="stat-header">
            <span>Дата создания</span>
          </div>
          <div className="stat-value">
            {new Date(form.date).toLocaleDateString("ru-RU")}
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ marginTop: "2rem" }}>
        <div className="chart-header">
          <span>Динамика регистраций</span>
        </div>
        <div className="chart-wrapper">
          <canvas ref={chartRef} />
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          className="secondary-button"
          onClick={() => window.history.back()}
        >
          Назад
        </button>
      </div>
    </div>
  );
};

export default FormAnalytics;
