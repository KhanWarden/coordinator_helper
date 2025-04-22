import React, { useState } from 'react';
import './todolist.css';

interface Task {
    id: number;
    text: string;
    isCompleted: boolean;
}

const TodoListPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>('');

    const handleAddTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { id: Date.now(), text: newTask, isCompleted: false }]);
            setNewTask('');
        }
    };

    const handleToggleCompletion = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="todo-container">
            <div className="input-wrapper">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Добавьте задачу"
                />
                <button onClick={handleAddTask}>Добавить</button>
            </div>

            <ul className="todo-list">
                {tasks.map((task) => (
                    <li key={task.id} className={task.isCompleted ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => handleToggleCompletion(task.id)}
                        />
                        <span>{task.text}</span>
                        <button onClick={() => handleDeleteTask(task.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoListPage;
