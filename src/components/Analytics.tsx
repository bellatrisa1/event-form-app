import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FormItem } from "../types";
import { formatDate } from "../utils/dateUtils"; // ✅ Import

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
            labels: forms.map((form) => formatDate(form.date)), // ✅ Safe
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
        {/* SVG icon */}
        Аналитика форм
      </h2>
      <div className="analytics-description">
        Статистика по вашим мероприятиям
      </div>
      <div className="analytics-grid">
        <div className="stats-container">
          <div className="stat-card orange">
            <div className="stat-header">
              {/* SVG icon */}
              <span>Всего участников</span>
            </div>
            <div className="stat-value">{totalResponses}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-header">
              {/* SVG icon */}
              <span>Средний рейтинг</span>
            </div>
            <div className="stat-value">{averageRating}</div>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-header">
            {/* SVG icon */}
            <span>Динамика регистраций</span>
          </div>
          <div className="chart-wrapper">
            <canvas ref={chartRef} width="302" height="160"></canvas>
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
                  <td>{formatDate(form.date)}</td> {/* ✅ Safe rendering */}
                  <td>{formatDate(form.lastUpdated)}</td>
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
