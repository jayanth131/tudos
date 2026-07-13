import React, { useState, useEffect } from 'react';
import API from './api';
import { Trash2, Edit3, Check, LogOut, Plus, X } from 'lucide-react';

export default function TodoDashboard({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await API.get('/todos');
      setTodos(data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const { data } = await API.post('/todos', { title: newTodo });
      setTodos([data, ...todos]);
      setNewTodo('');
    } catch (err) {
      console.error('Failed to create todo', err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const { data } = await API.patch(`/todos/${id}/status`, { completed: !currentStatus });
      setTodos(todos.map(t => t._id === id ? data : t));
    } catch (err) {
      // Fallback if PATCH endpoint isn't linked: use PUT
      const { data } = await API.put(`/todos/${id}`, { completed: !currentStatus });
      setTodos(todos.map(t => t._id === id ? data : t));
    }
  };

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      const { data } = await API.put(`/todos/${id}`, { title: editingText });
      setTodos(todos.map(t => t._id === id ? data : t));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to edit todo', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Workspace Tasks</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Welcome, {user.name}</span>
          <button onClick={onLogout} className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content View */}
      <main className="max-w-2xl mx-auto mt-10 px-4">
        {/* Input Form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            className="flex-1 px-4 py-2.5 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition">
            <Plus size={20} />
          </button>
        </form>

        {/* Todo Render List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No tasks added yet. Start planning!</p>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer flex-shrink-0"
                    onChange={() => handleToggleStatus(todo._id, todo.completed)}
                  />
                  
                  {editingId === todo._id ? (
                    <input
                      type="text"
                      value={editingText}
                      className="flex-1 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    <span className={`text-gray-800 break-words truncate block flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                      {todo.title}
                    </span>
                  )}
                </div>

                {/* Operations Action Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {editingId === todo._id ? (
                    <>
                      <button onClick={() => handleSaveEdit(todo._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(todo._id); setEditingText(todo.title); }} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDeleteTodo(todo._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}