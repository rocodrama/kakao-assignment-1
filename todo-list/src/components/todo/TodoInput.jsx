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
            <div className="flex flex-row gap-2 mb-4">
                <input className="bg-white border-2 border-solid border-surface-border w-full sm:w-100 px-4 py-2 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    value={todoInput}
                    onChange={handleChangeTodoInput}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="할 일을 입력하세요."/>
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                onClick={handleAddTodo}
                disabled={isDisabled}>
                    추가
                </button>
            </div>
            {errorMessage && <p className="text-red-500 text-center text-1">{errorMessage}</p>}
        </div>

    )    
}
