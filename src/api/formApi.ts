import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem } from "../types";

// Получение всех форм
export const fetchForms = async (): Promise<FormItem[]> => {
  const snapshot = await getDocs(collection(db, "forms"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FormItem[];
};

// Создание новой формы
export const createForm = async (
  formData: Omit<FormItem, "id">
): Promise<FormItem> => {
  const docRef = await addDoc(collection(db, "forms"), {
    ...formData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...formData } as FormItem;
};

// Получение всех регистраций
export const fetchRegistrations = async (): Promise<any[]> => {
  const snapshot = await getDocs(collection(db, "registrations"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}; // ✅ Вот здесь была пропущена закрывающая скобка

// Обновление формы по ID
export const updateForm = async (
  formId: string,
  formData: Partial<Omit<FormItem, "id" | "date" | "submissions">>
): Promise<void> => {
  const formRef = doc(db, "forms", formId);
  await updateDoc(formRef, {
    ...formData,
    lastUpdated: serverTimestamp(),
  });
};
