import React from 'react';
import { FilterType } from '../types/todo';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  onFilterChange,
  stats,
  onClearCompleted,
}) => {
  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'active', label: 'Active', count: stats.active },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
      <div className="flex gap-2">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              currentFilter === key
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            {label}
            {count !== undefined && (
              <span className="ml-2 px-2 py-1 text-xs bg-black/10 rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          {stats.active} {stats.active === 1 ? 'item' : 'items'} left
        </span>
        {stats.completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
};