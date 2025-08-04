import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FormItem, RegistrationItem } from "../types";

// Получение всех форм
export const fetchForms = async (): Promise<FormItem[]> => {
  try {
    const snapshot = await getDocs(collection(db, "forms"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || "",
      date: doc.data().date || new Date().toISOString(),
      submissions: doc.data().submissions || 0,
      lastUpdated: doc.data().lastUpdated || "N/A",
      icon: doc.data().icon || "calendar",
      color: doc.data().color || "orange",
      ownerId: doc.data().ownerId || "",
      rating: doc.data().rating || 0,
    })) as FormItem[];
  } catch (error) {
    throw new Error(`Ошибка при получении форм: ${(error as Error).message}`);
  }
};

// Создание новой формы
export const createForm = async (
  formData: Omit<FormItem, "id" | "createdAt">
): Promise<FormItem> => {
  try {
    const docRef = await addDoc(collection(db, "forms"), {
      ...formData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...formData, createdAt: null } as FormItem;
  } catch (error) {
    throw new Error(`Ошибка при создании формы: ${(error as Error).message}`);
  }
};

// Получение всех регистраций
export const fetchRegistrations = async (): Promise<RegistrationItem[]> => {
  try {
    const snapshot = await getDocs(collection(db, "registrations"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RegistrationItem[];
  } catch (error) {
    throw new Error(
      `Ошибка при получении регистраций: ${(error as Error).message}`
    );
  }
};

// Обновление форм
export const updateForm = async (
  formId: string,
  formData: Partial<Omit<FormItem, "id" | "date" | "submissions">>
): Promise<void> => {
  try {
    const formRef = doc(db, "forms", formId);
    await updateDoc(formRef, {
      ...formData,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(`Ошибка при обновлении формы: ${(error as Error).message}`);
  }
};

// Удаление форм
export const deleteForm = async (formId: string): Promise<void> => {
  try {
    const formRef = doc(db, "forms", formId);
    await deleteDoc(formRef);
  } catch (error) {
    throw new Error(`Ошибка при удалении формы: ${(error as Error).message}`);
  }
};
