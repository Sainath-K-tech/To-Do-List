import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit3, Trash2 } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onEdit,
  onStartEdit,
  onCancelEdit,
}) => {
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, editText);
    } else {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.text);
      onCancelEdit();
    }
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
              : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
          }`}
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 bg-white border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </form>
        ) : (
          <span
            className={`flex-1 text-lg transition-all duration-300 ${
              todo.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
            onDoubleClick={() => !todo.completed && onStartEdit(todo.id)}
          >
            {todo.text}
          </span>
        )}

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isEditing ? (
            <>
              <button
                onClick={handleEditSubmit}
                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
              >
                <Check size={16} />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              {!todo.completed && (
                <button
                  onClick={() => onStartEdit(todo.id)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                >
                  <Edit3 size={16} />
                </button>
              )}
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};