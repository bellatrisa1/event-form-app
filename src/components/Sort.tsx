import React from "react";

interface SortProps {
  onSortChange: (option: string) => void;
  selectedSort: string;
  totalForms: number;
}

function Sort({ onSortChange, selectedSort, totalForms }: SortProps) {
  return (
    <div className="forms-sort">
      <div className="forms-count">
        Всего форм: <span>{totalForms}</span>
      </div>
      <div className="sort-container">
        <label htmlFor="sort">Сортировать:</label>
        <select
          id="sort"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="date">По дате</option>
          <option value="alphabet">По алфавиту</option>
          <option value="submissions">По количеству ответов</option>
        </select>
      </div>
    </div>
  );
}

export default Sort;
