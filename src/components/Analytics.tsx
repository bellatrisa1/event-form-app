import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ChartConfiguration } from "chart.js";
import { FormItem } from "../types";
import { BarChart3, Users, Star } from "lucide-react";

interface AnalyticsProps {
  forms: FormItem[];
}

const Analytics: React.FC<AnalyticsProps> = ({ forms }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const totalResponses = forms.reduce((sum, form) => sum + form.submissions, 0);

  const averageRating = forms.length
    ? forms.reduce((sum, form) => sum + (form.rating || 0), 0) / forms.length
    : 0;

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        labels: forms.map((form) =>
          new Date(form.date).toLocaleDateString("ru-RU")
        ),
        datasets: [
          {
            label: "Регистрации",
            data: forms.map((form) => form.submissions),
            borderColor: "#7C3AED",
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Количество регистраций" },
          },
          x: { title: { display: true, text: "Дата создания" } },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forms]);

  return (
    <div className="analytics-section">
      <h2>
        <BarChart3 className="inline-block mr-2" size={24} />
        Аналитика форм
      </h2>
      <div className="analytics-description">
        Статистика по вашим мероприятиям
      </div>
      <div className="analytics-grid">
        <div className="stats-container">
          <div className="stat-card orange">
            <div className="stat-header">
              <Users className="inline-block mr-2" size={24} />
              <span>Всего участников</span>
            </div>
            <div className="stat-value">{totalResponses}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              <Star className="inline-block mr-2" size={24} />
              <span>Средний рейтинг</span>
            </div>
            <div className="stat-value">
              {averageRating ? averageRating.toFixed(1) : "N/A"}
            </div>
          </div>
        </div>
        <div className="chart-container">
          <canvas ref={chartRef} />
        </div>
      </div>

      <div className="analytics-table">
        <table>
          <thead>
            <tr>
              <th>Форма</th>
              <th>Ответы</th>
              <th>Дата создания</th>
              <th>Последний ответ</th>
            </tr>
          </thead>
          <tbody>
            {forms.length > 0 ? (
              forms.map((form) => (
                <tr key={form.id}>
                  <td className="orange-text">{form.title}</td>
                  <td>{form.submissions}</td>
                  <td>{new Date(form.date).toLocaleDateString("ru-RU")}</td>
                  <td>{form.lastUpdated || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Нет данных</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
