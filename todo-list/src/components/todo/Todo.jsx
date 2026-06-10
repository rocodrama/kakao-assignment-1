import {useState, useEffect} from 'react';
import TodoInput from './TodoInput';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';

export default function Todo({displayDate, setDisplayDate}) {
    const [todos, setTodos] = useState(() => {
        const storedTodos = localStorage.getItem("todos");
        return storedTodos ? JSON.parse(storedTodos) : [];
    });

    const [filter, setFilter] = useState('전체');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
        
    return (
        <div className="w-[600px]">
            {/* 입력창 */}
            <TodoInput displayDate={displayDate} setDisplayDate={setDisplayDate} todos={todos} setTodos={setTodos} />

            {/* 필터 선택 */}
            <TodoFilter filter={filter} setFilter={setFilter} />

            {/* 항목 리스트 */}
            <TodoList displayDate={displayDate} setDisplayDate={setDisplayDate} todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter}/>
        </div>
    )
}