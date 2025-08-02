import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types";

interface JsonForm {
  id: string;
  title: string;
  icon: string;
  color: string;
  responses: number;
  lastUpdated: string;
}

export const seedForms = async () => {
  try {
    const response = await fetch("/data.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data.json");
    }
    const jsonData: JsonForm[] = await response.json();
    for (const form of jsonData) {
      const formData: FormItem = {
        id: form.id,
        title: form.title,
        date: new Date().toISOString(),
        submissions: form.responses,
        lastUpdated: form.lastUpdated,
        icon: form.icon,
        color: form.color,
      };
      await setDoc(doc(collection(db, "forms"), form.id), formData);
      console.log(`Form ${form.title} uploaded successfully`);
    }
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
