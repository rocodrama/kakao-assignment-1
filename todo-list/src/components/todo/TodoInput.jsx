import {useState, useEffect} from 'react';

export default function TodoInput({displayDate, setDisplayDate, todos, setTodos}) {
    const [todoInput, setTodoInput] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [keyNum, setKeyNum] = useState(0);

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

    return (
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

    )    
}
