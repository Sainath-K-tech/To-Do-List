import React from 'react';
import { CheckSquare } from 'lucide-react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    filter,
    editingId,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    setEditingId,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <CheckSquare size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TodoFlow
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Organize your life, one task at a time
          </p>
        </div>

        {/* Todo Form */}
        <TodoForm onAddTodo={addTodo} />

        {/* Todo List */}
        <TodoList
          todos={todos}
          editingId={editingId}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onEditTodo={editTodo}
          onStartEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
        />

        {/* Filters */}
        {stats.total > 0 && (
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={stats}
            onClearCompleted={clearCompleted}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Double-click to edit • Built with React & TypeScript</p>
        </div>
      </div>
    </div>
  );
}

export default App;