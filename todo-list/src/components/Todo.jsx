import {useState} from 'react';

export default function Todo({displayDate, setDisplayDate}) {
    const [todoInput, setTodoInput] = useState('');
    const [todos, setTodos] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [keyNum, setKeyNum] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    const [filter, setFilter] = useState('전체');

    const handleChangeTodoInput = (e) => {
        setTodoInput(e.target.value);
        setIsDisabled(e.target.value === '');
    }

    const handleAddTodo = () => {
        if (todoInput.trim() === '') {
            setErrorMessage('공백은 입력할 수 없어요.');
            setTodoInput('');
            return;
        }
        setErrorMessage('');

        const newTodo = {
            id: keyNum,
            text: todoInput,
            isCompleted: false,
            date: displayDate.toLocaleDateString()
        }

        setTodos([...todos, newTodo]);
        setTodoInput('');
        setKeyNum(keyNum + 1);
    }

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
        <div className="w-[600px]">
            {/* 입력창 */}
            <div className="flex flex-col justify-center items-center mb-4">
                <div className="flex flex-row gap-[8px] mb-4">
                    <input className="bg-[#fff]  border-2 border-solid border-[#8FAFD9] w-[400px] px-4 py-2 rounded focus:outline-0 focus:border-[#497CBF] "
                        value={todoInput}
                        onChange={handleChangeTodoInput}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                        placeholder="할 일을 입력하세요."/>
                    <button className="bg-[#497CBF] text-[#fff] px-4 py-2 rounded hover:bg-[#3A5A8C] disabled:bg-[#8FAFD9]"
                    onClick={handleAddTodo} 
                    disabled={isDisabled}>
                        추가
                    </button>
                </div>
                {errorMessage && <p className="text-red-500 text-center text-1">{errorMessage}</p>}
            </div>

            {/* 필터 선택 */}
            <div className="flex flex-row justify-between items-center mb-2 gap-[8px]">
                <button className={`${filter === '전체' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
                onClick={() => setFilter('전체')} >
                    전체
                </button>
                <button className={`${filter === '완료' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
                onClick={() => setFilter('완료')} >
                    완료
                </button>
                <button className={`${filter === '진행중' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
                onClick={() => setFilter('진행중')} >
                    진행중
                </button>
            </div>
           

            {/* 항목 리스트 */}
            <div>
                <ul className="flex flex-col justify-center items-center">
                    {handleFilterTods(filter).filter((todo) => todo.date === displayDate.toLocaleDateString()).map((todo) => (
                        <li key={todo.id} className="bg-[#fff] border-1 border-solid border-[#497CBF] w-full px-4 py-2 rounded mb-2 flex flex-row justify-between items-center gap-[8px]">
                            <input type="checkbox" onChange={() => handleCompleteTodo(todo.id)} />
                            
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
        </div>
    )
}