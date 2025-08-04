import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types";

export const seedForms = async () => {
  const forms: Omit<FormItem, "id">[] = [
    {
      title: "Вечеринка выпускников",
      date: new Date().toISOString(),
      submissions: 10,
      lastUpdated: new Date().toISOString(),
      icon: "users",
      color: "orange",
      ownerId: "user123",
      rating: 4.8,
    },
    {
      title: "Конференция по IT",
      date: new Date().toISOString(),
      submissions: 5,
      lastUpdated: new Date().toISOString(),
      icon: "mic",
      color: "purple",
      ownerId: "user123",
      rating: 4.8,
    },
    {
      title: "Книжный клуб",
      date: new Date().toISOString(),
      submissions: 3,
      lastUpdated: new Date().toISOString(),
      icon: "book-open",
      color: "blue",
      ownerId: "user123",
      rating: 4.8,
    },
  ];

  try {
    for (const form of forms) {
      await addDoc(collection(db, "forms"), form);
    }
    console.log("База данных успешно заполнена!");
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error);
    throw error;
  }
};
