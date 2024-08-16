import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null); // 選択されたタスクのIDを保持
    
    useEffect(() => {
        getTasks();
    }, []);

    // const goAppEndpoint = process.env.GO_APP_ENDPOINT || 'http://localhost:8080';
    const goAppEndpoint = 'http://go-api.go-react-app:8080';

    const getTasks = async () => {
        try {
            const response = await fetch(`${goAppEndpoint}/tasks`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('タスクの取得に失敗しました:', error);
        }
    };

    const addTask = async () => {
        if (newTaskName.trim() === '') return;

        try {
            const response = await fetch(`${goAppEndpoint}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newTaskName }),
            });
            if (response.ok) {
                getTasks();
                setNewTaskName('');
            }
        } catch (error) {
            console.error('タスクの追加に失敗しました:', error);
        }
    };

    const toggleTaskDone = async () => {
        if (selectedTaskId === null) return;

        const task = tasks.find(task => task.id === selectedTaskId);
        if (!task) return;
        try {
            const response = await fetch(`${goAppEndpoint}/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...task, done: !task.done }),
            });
            if (response.ok) {
                getTasks();
                setSelectedTaskId(null); // 操作後に選択状態を解除
            }
        } catch (error) {
            console.error('タスクの更新に失敗しました:', error);
        }
    };

    const deleteTask = async () => {
        if (selectedTaskId === null) return;
        const task = tasks.find(task => task.id === selectedTaskId);
        if (!task) return;
        try {
            const response = await fetch(`${goAppEndpoint}/tasks/${task.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // タスク削除後にタスクリストを再取得
                getTasks();
                setSelectedTaskId(null); // 削除後に選択状態を解除
            } else {
                console.error('タスクの削除に失敗しました:', response.statusText);
            }
        } catch (error) {
            console.error('タスクの削除に失敗しました:', error);
        }
    };

    const handleTaskClick = (taskId) => {
        setSelectedTaskId(taskId);
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
            <div>
                <button onClick={toggleTaskDone}>終了</button>
                <button onClick={deleteTask}>削除</button>
            </div>
            <ul>
                {tasks.map(task => (
                    <li 
                    key={task.id} 
                    onClick={() => handleTaskClick(task.id)} 
                    style={{
                        cursor: 'pointer',
                        backgroundColor: task.id === selectedTaskId ? '#f0f0f0' : 'white'
                    }}
                >
                    <label style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                        {task.name}
                    </label>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
