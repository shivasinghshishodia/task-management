import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export default function Tasks() {
  const queryClient = useQueryClient();
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // 1. Fetch tasks (v5 syntax: object with queryKey + queryFn)
  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return res.json();
    },
  });

  // 2. Create task mutation (v5 syntax: object with mutationFn, onSuccess, etc.)
  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskText('');
    },
  });

  // 3. Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // 4. Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      const res = await fetch(`http://localhost:8000/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: updatedTask.text }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTaskId(null);
      setEditingTaskText('');
    },
  });

  // Handlers
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    createTaskMutation.mutate({ text: newTaskText });
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleUpdateTask = (taskId) => {
    if (editingTaskText.trim() === '') return;
    updateTaskMutation.mutate({ id: taskId, text: editingTaskText });
  };

  // Render states
  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="container">
      <h2>Tasks</h2>
      <form onSubmit={handleAddTask}>
        <input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="New Task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks?.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <>
                <input
                  value={editingTaskText}
                  onChange={(e) => setEditingTaskText(e.target.value)}
                />
                <button onClick={() => handleUpdateTask(task.id)}>Save</button>
                <button
                  onClick={() => {
                    setEditingTaskId(null);
                    setEditingTaskText('');
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{task.text}</span>
                <button onClick={() => handleEditTask(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {(createTaskMutation.isError ||
        deleteTaskMutation.isError ||
        updateTaskMutation.isError) && (
        <div>Error processing task action.</div>
      )}
    </div>
  );
}
