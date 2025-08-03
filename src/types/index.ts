// src/types/index.ts

/**
 * A form created by the user (e.g. "Вечеринка выпускников")
 */
export interface FormItem {
  id: string;
  title: string;
  date: string;
  submissions: number;
  lastUpdated: string;
  icon?: string;
  color?: string;
  createdAt?: any; // Firestore timestamp
}

/**
 * A user's registration response to a form
 */
export interface Registration {
  id: string;
  formId: string;
  name: string;
  email: string;
  submittedAt: any; // Firestore timestamp
}

/**
 * Valid sort options for dashboard
 */
export type SortOption = "date" | "alphabet" | "submissions";
