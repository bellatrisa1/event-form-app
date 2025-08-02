import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types";
import Chart from "chart.js/auto";

const FormAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!id) return;
      try {
        const formRef = doc(db, "forms", id);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setForm({ id: formSnap.id, ...formSnap.data() } as FormItem);
        }
      } catch (err) {
        console.error("Ошибка загрузки формы:", err);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  // Простой график — количество регистраций (в реальности можно брать из `registrations`)
  useEffect(() => {
    if (!chartRef.current || !form) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Имитация данных (в будущем — реальные данные из Firestore)
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const data = Array(7)
      .fill(0)
      .map(() => Math.floor(Math.random() * 5));

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Регистрации",
            data: data,
            backgroundColor: "rgba(124, 58, 237, 0.6)",
            borderColor: "#7C3AED",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [form]);

  if (loading) return <div className="container">Загрузка...</div>;
  if (!form) return <div className="container">Форма не найдена</div>;

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
          <span>Динамика регистраций (пример)</span>
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
