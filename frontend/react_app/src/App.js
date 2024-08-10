import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('タスクの取得に失敗しました:', error);
        }
    };

    const addTask = async () => {
        if (newTaskName.trim() === '') return;

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newTaskName }),
            });
            if (response.ok) {
                fetchTasks();
                setNewTaskName('');
            }
        } catch (error) {
            console.error('タスクの追加に失敗しました:', error);
        }
    };

    const toggleTaskDone = async (task) => {
        try {
            const response = await fetch(`/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...task, done: !task.done }),
            });
            if (response.ok) {
                fetchTasks();
            }
        } catch (error) {
            console.error('タスクの更新に失敗しました:', error);
        }
    };

    return (
        <div>
            <h1>タスク管理</h1>
            <input 
                type="text" 
                value={newTaskName} 
                onChange={(e) => setNewTaskName(e.target.value)} 
                placeholder="新しいタスクを追加" 
            />
            <button onClick={addTask}>追加</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <label style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                            <input 
                                type="checkbox" 
                                checked={task.done} 
                                onChange={() => toggleTaskDone(task)} 
                            />
                            {task.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
