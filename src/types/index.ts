export interface FormItem {
  id: string;
  title: string;
  date: string;
  submissions: number;
  lastUpdated: string;
  icon?: string; // Optional to support data.json
  color?: string; // Optional to support data.json
}