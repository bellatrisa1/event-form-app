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
  date: string;
  submissions: number;
  lastUpdated: string;
  icon?: string;
  color?: string; 
  ownerId?: string;
  rating?: number;
}
