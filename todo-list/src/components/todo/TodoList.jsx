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
                    <li key={todo.id} className="bg-[#fff] border-1 border-solid border-[#497CBF] w-full px-4 py-2 rounded mb-2 flex flex-row justify-between items-center gap-[8px]">
                        <input type="checkbox" checked={todo.isCompleted} onChange={() => handleCompleteTodo(todo.id)}  />
                        
                        { editId === todo.id ?
                            <input className="bg-[#fff]  border-2 border-solid border-[#8FAFD9] w-[400px] px-4 py-2 rounded focus:outline-0 focus:border-[#497CBF] "
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleEndEditTodo(todo.id)}
                                autoFocus
                            />
                            :
                            <span className={`w-full ${todo.isCompleted ? 'line-through' : ''}`}>{todo.text}</span>
                        }

                        <button className="bg-[#497CBF] text-[#fff] w-20 h-8 rounded hover:bg-[#3A5A8C]"
                            onClick={ editId === todo.id ? () => handleEndEditTodo(todo.id) : () => handleStartEditTodo(todo.id)}>
                            {editId === todo.id ? '완료' : '수정'}
                        </button>

                        <button className="bg-[#8FAFD9] text-[#fff] w-20 h-8 rounded hover:bg-[#3A5A8C]" onClick={() => handleDeleteTodo(todo.id)}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}