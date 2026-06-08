import {useState} from 'react';

export default function Todo() {
    const [todoInput, setTodoInput] = useState('');
    const [todos, setTodos] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [keyNum, setKeyNum] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

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
        }

        setTodos([...todos, newTodo]);
        setTodoInput('');
        setKeyNum(keyNum + 1);
    }

    const handleCompleteTodo = (id) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo));
    }

    const handleEditTodo = (id) => {
        const editText = prompt('할 일을 수정하세요.', todos.find(todo => todo.id === id).text);  
        setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText } : todo));
        return
    }

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    }

        
    return (
        <div className="w-[600px]">
            {/* 입력창 */}
            <div className="flex flex-col justify-center items-center mb-4">
                <div className="flex flex-row gap-[8px] mb-4">
                    <input className="bg-[#fff]  border-2 border-solid border-[#8FAFD9] w-[400px] px-4 py-2 rounded focus:outline-0 focus:border-[#497CBF] "
                        value={todoInput}
                        onChange={handleChangeTodoInput}
                        placeholder="할 일을 입력하세요."/>
                    <button className="bg-[#497CBF] text-[#fff] px-4 py-2 rounded hover:bg-[#3A5A8C] disabled:bg-[#8FAFD9]"
                    onClick={handleAddTodo} 
                    disabled={isDisabled}>
                        추가
                    </button>
                </div>
                {errorMessage && <p className="text-red-500 text-center text-1">{errorMessage}</p>}
            </div>

           

            {/* 항목 리스트 */}
            <div>
                <ul className="flex flex-col justify-center items-center">
                    {todos.map((todo) => (
                        <li className="bg-[#fff] border-1 border-solid border-[#497CBF] w-full px-4 py-2 rounded mb-2 flex flex-row justify-between items-center gap-[8px]">
                            <input type="checkbox" onChange={() => handleCompleteTodo(todo.id)} />
                            
                            <span className={`w-full ${todo.isCompleted ? 'line-through' : ''}`}>{todo.text}</span>

                            <button className="bg-[#497CBF] text-[#fff] w-20 h-8 roundedhover:bg-[#3A5A8C]"
                            onClick={() => handleEditTodo(todo.id)}>
                                수정
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