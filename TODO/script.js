class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.filters = document.getElementById('filters');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.itemsLeft = document.getElementById('itemsLeft');
        this.allCount = document.getElementById('allCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    bindEvents() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Input changes
        this.todoInput.addEventListener('input', () => {
            this.updateAddButton();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Focus input on load
        this.todoInput.focus();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: this.generateId(),
            text,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.updateAddButton();
        this.saveTodos();
        this.render();
        this.todoInput.focus();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date();
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('removing');
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
            }, 300);
        }
    }

    startEdit(id) {
        this.editingId = id;
        this.render();
        
        // Focus and select the edit input
        setTimeout(() => {
            const editInput = document.querySelector('.todo-edit');
            if (editInput) {
                editInput.focus();
                editInput.select();
            }
        }, 0);
    }

    saveEdit(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo && newText.trim()) {
            todo.text = newText.trim();
            todo.updatedAt = new Date();
            this.saveTodos();
        }
        this.editingId = null;
        this.render();
    }

    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    getStats() {
        return {
            total: this.todos.length,
            active: this.todos.filter(todo => !todo.completed).length,
            completed: this.todos.filter(todo => todo.completed).length
        };
    }

    updateAddButton() {
        const hasText = this.todoInput.value.trim().length > 0;
        this.addBtn.disabled = !hasText;
    }

    createTodoElement(todo) {
        const isEditing = this.editingId === todo.id;
        
        return `
            <div class="todo-item" data-id="${todo.id}">
                <div class="todo-content">
                    <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" 
                         onclick="app.toggleTodo('${todo.id}')">
                        ${todo.completed ? `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                        ` : ''}
                    </div>
                    
                    ${isEditing ? `
                        <input type="text" class="todo-edit" value="${todo.text}" 
                               onkeydown="app.handleEditKeydown(event, '${todo.id}')"
                               onblur="app.saveEdit('${todo.id}', this.value)">
                    ` : `
                        <span class="todo-text ${todo.completed ? 'completed' : ''}"
                              ondblclick="${!todo.completed ? `app.startEdit('${todo.id}')` : ''}">${todo.text}</span>
                    `}
                    
                    <div class="todo-actions">
                        ${isEditing ? `
                            <button class="action-btn save-btn" onclick="app.saveEdit('${todo.id}', document.querySelector('.todo-edit').value)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                            </button>
                            <button class="action-btn cancel-btn" onclick="app.cancelEdit()">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        ` : `
                            ${!todo.completed ? `
                                <button class="action-btn edit-btn" onclick="app.startEdit('${todo.id}')">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            ` : ''}
                            <button class="action-btn delete-btn" onclick="app.deleteTodo('${todo.id}')">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                                </svg>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    handleEditKeydown(event, id) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.saveEdit(id, event.target.value);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            this.cancelEdit();
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        const stats = this.getStats();

        // Update todo list
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✨</div>
                    <h3>All clear!</h3>
                    <p>You have no tasks. Time to add some!</p>
                </div>
            `;
        } else {
            this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');
        }

        // Update filters visibility and counts
        if (stats.total > 0) {
            this.filters.style.display = 'block';
            this.allCount.textContent = stats.total;
            this.activeCount.textContent = stats.active;
            this.completedCount.textContent = stats.completed;

            // Update active filter button
            this.filterBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
            });

            // Update items left
            const itemsLeftText = stats.active === 1 ? '1 item left' : `${stats.active} items left`;
            this.itemsLeft.textContent = itemsLeftText;

            // Show/hide clear completed button
            this.clearCompletedBtn.style.display = stats.completed > 0 ? 'block' : 'none';
        } else {
            this.filters.style.display = 'none';
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('todoflow-todos');
            if (saved) {
                return JSON.parse(saved).map(todo => ({
                    ...todo,
                    createdAt: new Date(todo.createdAt),
                    updatedAt: new Date(todo.updatedAt)
                }));
            }
        } catch (error) {
            console.error('Failed to load todos:', error);
        }
        return [];
    }

    saveTodos() {
        try {
            localStorage.setItem('todoflow-todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Failed to save todos:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input when pressing '/' or 'n'
    if ((e.key === '/' || e.key === 'n') && !e.target.matches('input, textarea')) {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
});