import React from "react";
import { Users, Mic, BookOpen, Calendar, LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  responses: number;
  lastUpdated: string;
  icon?: string;
  color?: string;
  onEdit?: () => void;
  onAnalyze?: () => void;
  onClone?: () => void;
  onDelete?: () => void; // ✅ Added
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  mic: Mic,
  "book-open": BookOpen,
  calendar: Calendar,
  default: Calendar,
};

const colorClasses: Record<string, string> = {
  orange: "bg-orange-100 text-orange-600",
  purple: "bg-purple-100 text-purple-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
};

function Card({
  title,
  responses,
  lastUpdated,
  icon = "default",
  color = "orange",
  onEdit,
  onAnalyze,
  onClone,
  onDelete,
}: CardProps) {
  const IconComponent = iconMap[icon] || iconMap.default;
  const colorClass = colorClasses[color] || colorClasses.orange;

  return (
    <div className="form-card bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-header flex items-center gap-3 mb-3">
        <div className={`card-icon ${colorClass} p-2 rounded-lg`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <span className="card-title font-medium text-gray-900">{title}</span>
      </div>
      <div className="card-meta text-sm text-gray-500 mb-4">
        {responses} ответов • обновлено: {lastUpdated}
      </div>
      <div className="card-actions flex gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="action-button flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>
            </svg>
            Редактировать
          </button>
        )}
        {onAnalyze && (
          <button
            type="button"
            onClick={onAnalyze}
            className="action-button flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
            Аналитика
          </button>
        )}
        {onClone && (
          <button
            type="button"
            onClick={onClone}
            className="action-button flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Клонировать
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="action-button flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
