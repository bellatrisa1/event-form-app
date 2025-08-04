// src/types/index.ts
export interface RegistrationItem {
  id: string;
  formId: string;
  name: string;
  email: string;
  submittedAt: string | null;
}

export interface FormItem {
  id: string;
  title: string;
  date: string; // ISO строка даты, например, '2025-08-04T12:00:00Z'
  submissions: number; // Количество регистраций
  lastUpdated: string; // ISO строка или 'Только что'
  icon?: string; // Например, 'users', 'mic', 'book-open', 'calendar'
  color?: string; // Например, 'orange', 'purple', 'blue'
  ownerId?: string; // ID пользователя, создавшего форму (для безопасности)
  rating?: number;
}
