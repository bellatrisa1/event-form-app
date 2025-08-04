import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchForms, createForm, deleteForm } from "../api/formApi";
import { FormItem } from "../types/index";

export const useForms = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("date");

  const {
    data: forms = [],
    isLoading,
    error,
  } = useQuery<FormItem[]>({
    queryKey: ["forms"],
    queryFn: fetchForms,
  });

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedForms = [...filteredForms].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "alphabet") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "submissions") {
      return b.submissions - a.submissions;
    }
    return 0;
  });

  const handleClone = async (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;
    try {
      const newForm: Omit<FormItem, "id"> = {
        title: `${form.title} (Копия)`,
        date: new Date().toISOString(),
        submissions: 0,
        lastUpdated: "Только что",
        icon: form.icon,
        color: form.color,
      };
      await createForm(newForm);
      await queryClient.invalidateQueries({ queryKey: ["forms"] });
    } catch (err) {
      throw new Error("Ошибка клонирования: " + (err as Error).message);
    }
  };

  const handleDelete = async (formId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту форму?")) {
      try {
        await deleteForm(formId);
        await queryClient.invalidateQueries({ queryKey: ["forms"] });
      } catch (err) {
        throw new Error("Ошибка удаления: " + (err as Error).message);
      }
    }
  };

  return {
    forms: sortedForms,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    handleClone,
    handleDelete,
  };
};
