import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FormItem } from "../types";

interface AnalyticsProps {
  forms: FormItem[];
}

const Analytics: React.FC<AnalyticsProps> = ({ forms }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const totalResponses = forms.reduce((sum, form) => sum + form.submissions, 0);
  const averageRating = 4.8;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
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
                title: {
                  display: true,
                  text: "Количество регистраций",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Дата создания",
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [forms]);

  return (
    <div className="analytics-section">
      <h2>
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
          className="lucide lucide-bar-chart-3"
        >
          <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
        Аналитика форм
      </h2>
      <div className="analytics-description">
        Статистика по вашим мероприятиям
      </div>
      <div className="analytics-grid">
        <div className="stats-container">
          <div className="stat-card orange">
            <div className="stat-header">
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
                className="lucide lucide-users"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <span>Всего участников</span>
            </div>
            <div className="stat-value">{totalResponses}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
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
                className="lucide lucide-star"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
              <span>Средний рейтинг</span>
            </div>
            <div className="stat-value">{averageRating}</div>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-header">
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
              className="lucide lucide-activity"
            >
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
            </svg>
            <span>Динамика регистраций</span>
          </div>
          <div className="chart-wrapper">
            <canvas
              id="regChart"
              ref={chartRef}
              width="302"
              height="160"
            ></canvas>
          </div>
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
                  <td>{form.lastUpdated}</td>
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
