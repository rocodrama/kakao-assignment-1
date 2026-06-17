import {useState} from 'react';
export default function TodoList({displayDate, setDisplayDate, todos, setTodos, filter, setFilter}) {

    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleCompleteTodo = (id) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
    }

    const handleStartEditTodo = (id) => {
        setEditId(id);
        setEditText(todos.find(todo => todo.id === id).text);
    }

    const handleEndEditTodo = (id) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText } : todo));
        setEditId(null);
        setEditText('');
    }

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    const handleFilterTods = (filter) => {
        if (filter === '전체') {
            return todos;
        } else if (filter === '완료') {
            return todos.filter(todo => todo.isCompleted);
        } else if (filter === '진행중') {
            return todos.filter(todo => !todo.isCompleted);
        }
    }

    return (
        <div>
            <ul className="flex flex-col justify-center items-center">
                {handleFilterTods(filter).filter((todo) => todo.date === displayDate.toLocaleDateString()).map((todo) => (
                    <li key={todo.id} className="bg-white border border-solid border-primary w-full px-4 py-2 rounded mb-2 flex flex-row justify-between items-center gap-2">
                        <input type="checkbox" checked={todo.isCompleted} onChange={() => handleCompleteTodo(todo.id)} />

                        { editId === todo.id ?
                            <input className="bg-white border-2 border-solid border-surface-border w-full px-4 py-2 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleEndEditTodo(todo.id)}
                                autoFocus
                            />
                            :
                            <span className={`w-full ${todo.isCompleted ? 'line-through' : ''}`}>{todo.text}</span>
                        }

                        <button className="bg-primary text-white w-20 h-8 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                            onClick={ editId === todo.id ? () => handleEndEditTodo(todo.id) : () => handleStartEditTodo(todo.id)}>
                            {editId === todo.id ? '완료' : '수정'}
                        </button>

                        <button className="bg-primary-light text-white w-20 h-8 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1" onClick={() => handleDeleteTodo(todo.id)}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}